import * as cdk from "@aws-cdk/core";
import { Api } from "./api";
import { CDN } from "./cdn";
import { Domain } from "./domain";
import { RemixStackProps } from "../types";

export class RemixStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: RemixStackProps) {
    super(scope, id, props);

    const {
      domainName,
      certificateArn,
      hostedZoneId,
      lambdaMemorySize,
      zoneName,
    } = props.remixStackConfig;

    const remixAPI = new Api(this, `${id}-api`, {
      lambdaMemorySize,
    });

    const cdn = new CDN(this, `${id}-cdn`, {
      certificateArn,
      domainName,
      httpApi: remixAPI.httpApi,
    });

    if (domainName && hostedZoneId && zoneName) {
      // If a hostedZoneId and domainName are set, link it to the CDN
      new Domain(this, `${id}-domain`, {
        distribution: cdn.distribution,
        domainName,
        hostedZoneId,
        zoneName,
      });
    }

    new cdk.CfnOutput(this, "apiUrl", { value: remixAPI.httpApi.url || "" });
    new cdk.CfnOutput(this, "cdnDomainName", {
      value: domainName ? domainName : cdn.distribution.domainName,
    });
    new cdk.CfnOutput(this, "lambdaFunctionName", {
      value: remixAPI.handler.functionName || "",
    });
  }
}
