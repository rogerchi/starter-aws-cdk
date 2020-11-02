import * as cdk from "@aws-cdk/core";
import { Api } from "./api";
import { CDN } from "./cdn";

export class RemixStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const remixAPI = new Api(this, `${id}-api`);

    const cdn = new CDN(this, `${id}-cdn`, {
      httpApi: remixAPI.httpApi,
    });

    new cdk.CfnOutput(this, "apiUrl", { value: remixAPI.httpApi.url || "" });
    new cdk.CfnOutput(this, "cdnDomainName", {
      value: cdn.distribution.domainName,
    });
  }
}
