import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as core from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as S3Deployment from "@aws-cdk/aws-s3-deployment";

// @ts-ignore -- implicitly 'any' type.
import * as remixConfig from "../../remix-starter-apigateway/remix.config";

interface CdnProps {
  httpApi: apigatewayv2.HttpApi;
}

export class CDN extends core.Construct {
  public distribution: cloudfront.Distribution;

  constructor(scope: core.Construct, id: string, props: CdnProps) {
    super(scope, id);
    const httpApiHost = (props.httpApi.url || "").split("/")[2];

    const staticBucket = new s3.Bucket(this, `${id}-static`);
    new S3Deployment.BucketDeployment(this, `${id}-static-deployment`, {
      sources: [
        S3Deployment.Source.asset("../remix-starter-apigateway/public"),
      ],
      destinationBucket: staticBucket,
    });

    this.distribution = new cloudfront.Distribution(
      this,
      `${id}-distribution`,
      {
        defaultBehavior: {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          origin: new origins.HttpOrigin(httpApiHost),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          [`${remixConfig.publicPath}*`]: {
            origin: new origins.S3Origin(staticBucket),
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
        },
      }
    );
  }
}
