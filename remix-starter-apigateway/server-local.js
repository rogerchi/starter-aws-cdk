//
// NOTE: This file will only be used for local development.
//       "server.js" will be used on AWS Lambda
//
const express = require("express");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");
const {
  createRequestHandlerConfig,
} = require("./create-request-handler-config");

let app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static("public"));

app.get("*", createRequestHandler(createRequestHandlerConfig));

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});
