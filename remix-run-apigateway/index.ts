import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import type { AppLoadContext } from "@remix-run/core";

const core = require("@remix-run/core");
const mimetypes = require("mime-types");

const fs = require("fs");
const path = require("path");
const url = require("url");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

export interface GetLoadContext {
  (event: APIGatewayProxyEvent, context: Context): AppLoadContext;
}
interface RemixConfig {
  getLoadContext?: GetLoadContext;
  root?: string;
}

let configPromise: Promise<any>;

// TODO: Improve Caching headers
async function serveStaticFileIfExists(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const config = await configPromise;

  // QUESTION: Is there a cleaner way to get this path?
  const publicDirectory = config.browserBuildDirectory.replace(
    config.publicPath.replace(/\/$/, ""), // Remove any trailing / from publicPath
    "" // remove publicPath from browserBuildDirectory
  );

  const filePath = path.join(publicDirectory, event.path);

  const fileContents = await readFileAsync(filePath);
  const mimeType = mimetypes.lookup(filePath) || "application/octet-stream";

  return {
    body: fileContents.toString(),
    headers: {
      "Content-Type": mimeType,
    },
    statusCode: 200,
  };
}

export function createRequestHandler({
  getLoadContext,
  root: remixRoot,
}: RemixConfig = {}): APIGatewayProxyHandler {
  configPromise = core.readConfig(remixRoot);
  let handleRequest = core.createRequestHandler(remixRoot);

  return async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    let loadContext;

    // If the file exists, return it right away
    try {
      return await serveStaticFileIfExists(event);
    } catch (error) {
      // no-op
    }

    if (getLoadContext) {
      try {
        loadContext = await getLoadContext(event, context);
      } catch (error) {
        console.error(error);
        return {
          // QUESTION: Do we want to expose this error?
          body: JSON.stringify(error),
          statusCode: 500,
        };
      }
    }

    let remixReq: Request = createRemixRequest(event);
    let remixRes;

    try {
      remixRes = await handleRequest(remixReq, loadContext);
    } catch (error) {
      // This is probably an error in one of the loaders.
      console.error(error);
      return {
        // QUESTION: Do we want to expose this error?
        body: JSON.stringify(error),
        statusCode: 500,
      };
    }

    const result: APIGatewayProxyResult = {
      // QUESTION: Do we need to support streams?/ remixRes.body.pipe(res);
      body: remixRes.body.toString(),
      headers: createPojoHeaders(remixRes.headers),
      statusCode: remixRes.status,
    };

    return result;
  };
}

function createRemixRequest(event: APIGatewayProxyEvent): Request {
  const protocol = event.headers["X-Forwarded-Proto"];
  const host = event.headers.Host;
  const path = event.path;

  const queryString = new URLSearchParams();
  Object.entries(
    event.multiValueQueryStringParameters || {}
  ).forEach(([key, values]) =>
    values.forEach((value) => queryString.append(key, value))
  );

  let origin = `${protocol}://${host}`;
  let url$1 = new url.URL(`${path}?${queryString.toString()}`, origin);
  let init: globalThis.RequestInit = {
    // QUESTION: Is this ok, or should we support event.multiValueHeaders
    headers: new core.Headers(event.headers),
    method: event.httpMethod,
  };

  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    init.body = event.body;
  }

  return new Request(url$1.toString(), init);
}

function createPojoHeaders(headers: Headers): Record<string, string> {
  // @ts-ignore -- Property 'entries' does not exist on type 'Headers'.
  const headerKeyValues: [string, string][] = Array.from(headers.entries());
  return headerKeyValues.reduce<Record<string, string>>(
    (memo, [key, value]) => {
      memo[key] = value;
      return memo;
    },
    {}
  );
}
