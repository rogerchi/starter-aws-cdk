#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { RemixStack } from "../lib/remix-stack";
import remixStackConfig from "../../remix-stack-config";

const stackName = remixStackConfig.stackName || "remix";
const app = new cdk.App();
const remixStack = new RemixStack(app, stackName, { remixStackConfig });

remixStack.api.handler.addEnvironment(
  "REMIX_COOKIE_SECRET",
  remixStackConfig.remixCookieSecret!
);

new cdk.CfnOutput(remixStack, "apiUrl", {
  value: remixStack.api.httpApi.url || "",
});
new cdk.CfnOutput(remixStack, "cdnDomainName", {
  value: remixStackConfig.domainName
    ? remixStackConfig.domainName
    : remixStack.cdn.distribution.domainName,
});
new cdk.CfnOutput(remixStack, "lambdaFunctionName", {
  value: remixStack.api.handler.functionName || "",
});
