# Test Go Service with AWS Fargate

This is a test repo used for demo purposes for deploying a Go server on AWS Fargate

## Local development
* `docker build -t service:latest .`
* `docker run -p 127.0.0.1:8080:8080 service:latest`
* Then in another terminal hit `curl http://127.0.0.1:8080/hello`
* should get `Hello from your Go API!` printed

## Deploying to AWS

### Limitation
Ideally a Fargate service should be fronted with an ALB to allow proper access to the API. but since the accounts used are on **free tier** we **can't** use **ALB**. Accordingly the steps below mentions a manually set up EC2 instance to test.

### Steps
* You must have AWS CDK CLI, AWS CLI installed and npm
* `cd cdk`
* `npm run build`
* Ensure AWS Creds are fresh for the account `947475729988` in `eu-west-1`
* `cdk synth`
* `cdk deploy --all`
* Manually setup an EC2 instance within the same subnet as the fargate task.
* Connect to the instance
* run `curl http://<private_IP_of_Fargate_task>:8080/hello`
* should get `Hello from your Go API!` printed

## Next steps
Follow the example in https://github.com/hazemmousa10/hazem-burner1-cdk and setup CI/CD

## Related work
* https://github.com/aws-samples/sqs-fargate-ddb-cdk-go
* https://github.com/hazemmousa10/hazem-burner1-cdk

## Useful links
* https://docs.docker.com/reference/cli/docker/buildx/build/#platform
* https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService.html
* 