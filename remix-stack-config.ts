import { RemixStackConfig } from "./cdk/types";

const remixStackConfig: RemixStackConfig = {
  // If not specified, the `stackName` will default to "remix"
  // stackName: "customStackName",
  //
  // You can optionally provide ENV variables for your lambda function
  // lambdaEnvironmentVariables: {
  //   YOUR_ENV_VAR_HERE: process.env.YOUR_ENV_VAR_HERE!,
  // },
  //
  // Configure the amount of memory available to your lambda function, in MB
  // Default is 128
  // lambdaMemorySize: 256,
  //
  // If you would like to configure a custom domain for your CDN you must
  // specify the `domainName` and a `certificateArn` for that domain.  The
  // certificate can be created at: https://console.aws.amazon.com/acm/home
  //
  // Note: Forcing the manual creation of this certificate allows us to support
  // domain names not controlled by Route53.  In this case you would need to
  // go to https://console.aws.amazon.com/cloudfront/home, view the distribution
  // details, and create a CNAME record on your domain provider to the
  // "Domain Name" of this distribution (xxxxxxxxxxxxxx.cloudfront.net)
  //
  // domainName: "your.domain.tld",
  // certificateArn:
  //   "arn:aws:acm:xx-xxxx-x:xxxxxxxxxxxx:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  //
  // However, if your domain is hosted in Route53, you can provide the
  // `hostZoneId` and `zoneName`, and a DNS A record will be created as an
  // alias to the created CloudFront Distribution for you.
  //
  // hostedZoneId: "XXXXXXXXXXXXXX",
  // zoneName: "yourZone.tld",
};

export default remixStackConfig;
