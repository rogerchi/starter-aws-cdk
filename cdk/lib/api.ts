import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as apigatewayv2Integrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";

export class Api extends core.Construct {
  public httpApi: apigatewayv2.HttpApi;

  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, `${scope}-defaultLambda`, {
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../remix-starter-apigateway")
      ),
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
        NODE_ENV: "production",
      },
      handler: "server.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: core.Duration.seconds(15),
      tracing: lambda.Tracing.DISABLED,
    });

    const integration = new apigatewayv2Integrations.LambdaProxyIntegration({
      handler,
      payloadFormatVersion: apigatewayv2.PayloadFormatVersion.VERSION_2_0,
    });

    this.httpApi = new apigatewayv2.HttpApi(this, `${scope}-api`, {
      defaultIntegration: integration,
    });
  }
}
