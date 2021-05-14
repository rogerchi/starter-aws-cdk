# Remix - Starter AWS CDK

This a mono-repo several packages to serve as an example getting up and
running with [Remix][remix] on AWS using [AWS CDK][aws-cdk].

It uses `@remix-run/architect` for the Remix bindings to AWS Lambda, but deploys via CDK.  The arc tools (e.g. `arc sandbox`) can still be used for local development.

It comprises of 2 packages:

- `remix-starter-architect` - The default Architect starter when running `npm init remix`
- `cdk` - An AWS CDK project to deploy `remix-starter-apigateway`

## Install

```bash
git clone git@github.com:m14t/starter-aws-cdk.git
cd starter-aws-cdk
npm ci
```

## Setup

The following steps need to be ran once before you can use AWS CDK on your
account.

1. [Configure your AWS credentials](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites).
2. [Boostrap your environment](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html).
   ```bash
   npm run bootstrap #installs NPM dependencies in all child projects
   cd cdk
   cdk bootstrap
   ```
3. `us-east-1` will also need to be cdk bootstrapped because Lambda@Edge functions are deployed there.

## Configure

The `remix-stack-config.ts` can be used to configure your deployment. It
contains the following options:

| Key                          | Default | Description                                                                                                                                                                           |
| ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stackname`                  | `remix` | The name of the CloudFormation stack that will be created                                                                                                                             |
| `domainName`                 |         | The domain name to be used as an alias for the CloudFront CDN distribution                                                                                                            |
| `lambdaMemorySize`           | `128`   | The amount of memory, in MB, to assign to the lambda function. After deploying, you can use [`lumigo-cli powertune-lambda`][lumigo-powertune] to determine the best value to use here |
| `lambdaEnvironmentVariables` |         | An object of key/value pairs of the ENV variables that you want to expose to your lambda function                                                                                     |
| `certificateArn`             |         | The ARN for the AWS Certificate Manager certificate for the `domainName`                                                                                                              |
| `hostedZoneId` & `zoneName`  |         | If both of these values are provided, then an A Record will be created in this hosted Zone for the `domainName`                                                                       |

## Deploy

The following command will use CDK to create a CloudFormation stack for the `remix-starter-apigateway` package.

```bash
npm run deploy
```

## Destroy

```bash
cd cdk
cdk destroy
```

<!-- links -->

[aws-cdk]: https://aws.amazon.com/cdk/
[lumigo-powertune]: https://github.com/lumigo-io/lumigo-cli#lumigo-cli-powertune-lambda
[remix]: https://remix.run/
[remix-run-apigateway]: https://github.com/m14t/remix-run-apigateway
