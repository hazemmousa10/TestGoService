import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets';
import path from 'path';
import * as logs from 'aws-cdk-lib/aws-logs';

export class FargateService extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const goServiceDockerImageAsset = new ecrAssets.DockerImageAsset(this, "GoServiceDockerImageAsset", {
      directory: path.join(__dirname, "..", ".."),
      platform: ecrAssets.Platform.LINUX_AMD64,
    });

    const goServiceEcsCluster = new ecs.Cluster(this, "GoServiceEcsCluster", {});

    const logGroup = new logs.LogGroup(this, "FargateLogGroup", {
      logGroupName: "GoServiceLogGroup"
    });

    const taskDef = new ecs.FargateTaskDefinition(this, "GoServiceTaskDef", {
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    const container = new ecs.ContainerDefinition(this, "GoServiceContainer", {
      image: ecs.ContainerImage.fromDockerImageAsset(goServiceDockerImageAsset),
      taskDefinition: taskDef,
      logging: new ecs.AwsLogDriver({
        logGroup: logGroup,
        streamPrefix: "GoServicePrefix",
      }),
      portMappings:[{
        containerPort: 8080,
        hostPort: 8080,
        name:"http-port",
        appProtocol: ecs.AppProtocol.http
      }],
    });

    const myService = new ecs.FargateService(this, "GoServiceFargate", {
      taskDefinition: taskDef,
      cluster: goServiceEcsCluster,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      serviceName: "GoServiceFargate",
      desiredCount: 1,
    });
  }
}
