const { createRequestHandler } = require("remix-run-apigateway");

exports.handler = createRequestHandler({
  getLoadContext() {
    // Whatever you return here will be passed as `context` to your loaders.
  },
});
