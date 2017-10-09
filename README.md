# aws-lambda-monitor-sqs-slack
AWS Lambda function to monitor SQS queue to a Slack channel

<img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/sqs.png"/>   <img width="100" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/arrow.png"/>  <img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/lambda.png"/>   <img width="100" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/arrow.png"/>   <img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/slack.png"/>

# Problem:

There are some SQS queues on amazon (+/- 10 queues, but the number of queues is growing every month). Queues are for different applications, different teams, and have different characteristics (error queues, different purposes, different thresholds etc.). The teams are responsible for adding new queues and specifying which queues are applicable to be monitored.

As a DevOps team we would like to monitor these queues by providing an automation solution which creates a monitor per queue according to a definition file where the queues are specified. So that we can be alerted whenever something goes wrong with the queues.

# Solution
Most IT people prefer Slack as comunication platfrom between teams

https://learn.getgrav.org/advanced/yaml

brew install aws-cli

aws sqs list-queues

aws sqs send-message --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/test_devops_edited_houses_errors --message-body "this is an error message"  --message-attributes file://msg.json

aws sqs get-queue-attributes --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/edited_houses  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesDelayed ApproximateNumberOfMessagesNotVisible
