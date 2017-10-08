# aws-lambda-monitor-sqs-slack
AWS Lambda function to monitor SQS queue to a Slack channel

https://learn.getgrav.org/advanced/yaml

brew install aws-cli

aws sqs list-queues

sqs send-message --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/edited_houses --message-body "Information about the largest city in Any Region."  --message-attributes file://msg.json

aws sqs get-queue-attributes --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/edited_houses  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesDelayed ApproximateNumberOfMessagesNotVisible
