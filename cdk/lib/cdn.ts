import * as path from 'path';
import * as certificatemanager from "@aws-cdk/aws-certificatemanager";
import * as core from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { EdgeFunction } from '@aws-cdk/aws-cloudfront/lib/experimental';
import * as lambda from '@aws-cdk/aws-lambda';
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as S3Deployment from "@aws-cdk/aws-s3-deployment";
import { CdnProps } from "../types";

// @ts-ignore -- implicitly 'any' type.
import * as remixConfig from "../../remix-starter-architect/remix.config";

export class CDN extends core.Construct {
  public distribution: cloudfront.Distribution;

  constructor(scope: core.Construct, id: string, props: CdnProps) {
    super(scope, id);
    const httpApiHost = (props.httpApi.url || "").split("/")[2];

    const staticBucket = new s3.Bucket(this, `${id}-static`);
    new S3Deployment.BucketDeployment(this, `${id}-static-deployment`, {
      sources: [
        S3Deployment.Source.asset("../remix-starter-architect/public"),
      ],
      destinationBucket: staticBucket,
    });

    let domainNames;
    let certificate;
    if (props.certificateArn && props.domainName) {
      certificate = certificatemanager.Certificate.fromCertificateArn(
        this,
        `${id}-certificate`,
        props.certificateArn
      );

      domainNames = [props.domainName];
    }

    const cachePolicy = new cloudfront.CachePolicy(this, `${id}-cachePolicy`, {
      cookieBehavior: cloudfront.CacheCookieBehavior.all(),
      defaultTtl: core.Duration.seconds(0),
      minTtl: core.Duration.seconds(0),
      maxTtl: core.Duration.days(10),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });
    
    const edgeFunction = new EdgeFunction(this, `${id}-edgeFunction`, {
      code: lambda.Code.fromAsset(path.join(__dirname, './url-rewrite')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    this.distribution = new cloudfront.Distribution(
      this,
      `${id}-distribution`,
      {
        domainNames,
        certificate,
        defaultBehavior: {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy,
          origin: new origins.HttpOrigin(httpApiHost),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          [`${remixConfig.publicPath}*`]: {
            origin: new origins.S3Origin(staticBucket),
            edgeLambdas: [
              {
                eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                functionVersion: edgeFunction.currentVersion,
              },
            ],
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
        },
      }
    );
  }
}
