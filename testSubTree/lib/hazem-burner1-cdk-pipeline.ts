import * as cdk from "aws-cdk-lib";
import * as pipelines from "aws-cdk-lib/pipelines";
import * as codeconnections from "aws-cdk-lib/aws-codeconnections"
import { Construct } from "constructs";
import { HazemBurner1CdkStage } from "./hazem-burner1-cdk-stage";

export class HazemBurner1CdkPipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define an AWS Code connection to Your Provider
    const codeConnection = new codeconnections.CfnConnection(this, "github-connection", {
      connectionName: "TestGithubConnection",
      providerType: "GitHub"
    });

    const pipeline = new pipelines.CodePipeline(this, 'app-pipeline', {
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.connection("hazemmousa10/hazem-burner1-cdk", "main", {
          connectionArn: codeConnection.attrConnectionArn,
          triggerOnPush: true
        }),
        commands:[
          "npm ci",
          "npm run build",
          "npx cdk synth",
        ],
      }),
      crossAccountKeys: true,
    });

    pipeline.addStage(new HazemBurner1CdkStage(this, "Test", {
      env: { account: '947475729988', region: 'eu-west-1' },
    }));
  }
} 