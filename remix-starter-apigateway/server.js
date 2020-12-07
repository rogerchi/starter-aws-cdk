//
// NOTE: This file will be used on AWS Lambda.
//       "server-local.js" will be used for local development
//
const {
  createRequestHandler,
  jwtCookieSessionHandlerFactory,
} = require("@m14t/remix-run-apigateway");
const {
  createRequestHandlerConfig,
} = require("./create-request-handler-config");

exports.handler = createRequestHandler({
  ...createRequestHandlerConfig,
  sessionHandler: jwtCookieSessionHandlerFactory({
    cookieName: "remixCookie",
    secret: process.env.REMIX_COOKIE_SECRET,
  }),
});
