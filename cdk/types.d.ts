import * as cdk from "@aws-cdk/core";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

type ApiConfig = {
  readonly lambdaEnvironmentVariables?: Record<string, string>;
  readonly lambdaMemorySize?: number;
};
export type ApiProps = ApiConfig;

type CdnConfig = {
  readonly certificateArn?: string;
  readonly domainName?: string;
};
export type CdnProps = CdnConfig & {
  readonly httpApi: apigatewayv2.HttpApi;
};

type DomainConfig = {
  readonly domainName?: string;
  readonly hostedZoneId?: string;
  readonly zoneName?: string;
};

export type DomainProps = DomainConfig & {
  readonly distribution: cloudfront.Distribution;
};

export type RemixStackConfig = ApiConfig &
  CdnConfig &
  DomainConfig & {
    readonly stackName?: string;
  };

export type RemixStackProps = {
  readonly remixStackConfig: RemixStackConfig;
} & cdk.StackProps;
