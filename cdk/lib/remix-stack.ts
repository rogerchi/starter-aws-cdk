import * as cdk from "@aws-cdk/core";
import { Api } from "./api";

export class RemixStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Api(this, `${id}-api`);
  }
}
