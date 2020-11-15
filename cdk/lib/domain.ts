import * as core from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
import { DomainProps } from "../types";

export class Domain extends core.Construct {
  constructor(scope: core.Construct, id: string, props: DomainProps) {
    super(scope, id);

    if (!props.domainName || !props.hostedZoneId || !props.zoneName) {
      throw new Error(
        "You must configure all of `domainName`, `hostedZoneId`," +
          " and `zoneName` if you want a Route53 record to be created."
      );
    }

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      `${id}-hostedZone`,
      {
        zoneName: props.zoneName,
        hostedZoneId: props.hostedZoneId,
      }
    );

    new route53.ARecord(this, `${id}-CdnARecord`, {
      zone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(props.distribution)
      ),
    });
  }
}
