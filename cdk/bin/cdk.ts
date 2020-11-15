#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { RemixStack } from "../lib/remix-stack";
import remixStackConfig from "../../remix-stack-config";

const stackName = remixStackConfig.stackName || "remix";
const app = new cdk.App();
new RemixStack(app, stackName, { remixStackConfig });
