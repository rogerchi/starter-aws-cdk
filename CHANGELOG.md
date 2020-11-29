# Changelog

## 2020-11-29

- Updated to work with @remix-run v0.8.0
- Extract `remix-run-apigateway` package to it's own [m14t/remix-run-apigateway](https://github.com/m14t/remix-run-apigateway) repo
  - This also changed the expected API Gateway payload format from v1 to v2
- Update the CDK config for the API Gateway integration to use the v2 payload format
- Update CDN CachePolicy to allow caching
- Update example Remix app's index route to cache on CDN for 5 seconds
- Add an option to configure the memory allocated to the Lambda function
- Add an option to configure the ENV variables exposed to the Lambda function
