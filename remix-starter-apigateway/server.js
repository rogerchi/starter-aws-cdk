//
// NOTE: This file will be used on AWS Lambda.
//       "server-local.js" will be used for local development
//
const { createRequestHandler } = require("@m14t/remix-run-apigateway");
const {
  createRequestHandlerConfig,
} = require("./create-request-handler-config");

exports.handler = createRequestHandler(createRequestHandlerConfig);
