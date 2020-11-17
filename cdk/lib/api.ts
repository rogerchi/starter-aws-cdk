import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as apigatewayv2Integrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import { ApiProps } from "../types";

export class Api extends core.Construct {
  public handler: lambda.Function;
  public httpApi: apigatewayv2.HttpApi;

  constructor(scope: core.Construct, id: string, props?: ApiProps) {
    super(scope, id);

    this.handler = new lambda.Function(this, `${scope}-defaultLambda`, {
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../remix-starter-apigateway")
      ),
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
        NODE_ENV: "production",
        ...props?.lambdaEnvironmentVariables,
      },
      handler: "server.handler",
      memorySize: props?.lambdaMemorySize || 128,
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: core.Duration.seconds(15),
      tracing: lambda.Tracing.DISABLED,
    });

    const integration = new apigatewayv2Integrations.LambdaProxyIntegration({
      handler: this.handler,
      payloadFormatVersion: apigatewayv2.PayloadFormatVersion.VERSION_2_0,
    });

    this.httpApi = new apigatewayv2.HttpApi(this, `${scope}-api`, {
      defaultIntegration: integration,
    });
  }
}
