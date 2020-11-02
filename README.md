# Install

```bash
git clone git@github.com:m14t/starter-aws-cdk.git
cd starter-aws-cdk
npm ci
```

# Setup

1. [Configure your AWS credentials](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites)
2. Before you can use AWS CDK, you need to [boostrap](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html) your environment.
   ```bash
   npm run bootstrap #installs NPM dependencies in all child projects
   cd cdk
   cdk bootstrap
   ```

# Deploy

```bash
npm run deploy
```

# Destroy

```bash
cd cdk
cdk destroy
```
