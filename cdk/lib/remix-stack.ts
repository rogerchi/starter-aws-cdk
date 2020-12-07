import * as cdk from "@aws-cdk/core";
import { Api } from "./api";
import { CDN } from "./cdn";
import { Domain } from "./domain";
import { RemixStackProps } from "../types";

export class RemixStack extends cdk.Stack {
  public api: Api;
  public cdn: CDN;
  public domain: Domain;

  constructor(scope: cdk.Construct, id: string, props: RemixStackProps) {
    super(scope, id, props);

    const {
      domainName,
      certificateArn,
      hostedZoneId,
      lambdaEnvironmentVariables,
      lambdaMemorySize,
      zoneName,
    } = props.remixStackConfig;

    this.api = new Api(this, `${id}-api`, {
      lambdaEnvironmentVariables,
      lambdaMemorySize,
    });

    this.cdn = new CDN(this, `${id}-cdn`, {
      certificateArn,
      domainName,
      httpApi: this.api.httpApi,
    });

    if (domainName && hostedZoneId && zoneName) {
      // If a hostedZoneId and domainName are set, link it to the CDN
      this.domain = new Domain(this, `${id}-domain`, {
        distribution: this.cdn.distribution,
        domainName,
        hostedZoneId,
        zoneName,
      });
    }
  }
}
