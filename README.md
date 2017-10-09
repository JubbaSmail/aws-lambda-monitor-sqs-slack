# aws-lambda-monitor-sqs-slack
AWS Lambda function to monitor SQS queue to a Slack channel

<img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/sqs.png"/>   <img width="100" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/arrow.png"/>  <img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/lambda.png"/>   <img width="100" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/arrow.png"/>   <img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/slack.png"/>

# Problem:

There are some SQS queues on amazon (+/- 10 queues, but the number of queues is growing every month). Queues are for different applications, different teams, and have different characteristics (error queues, different purposes, different thresholds etc.). The teams are responsible for adding new queues and specifying which queues are applicable to be monitored.

As a DevOps team we would like to monitor these queues by providing an automation solution which creates a monitor per queue according to a definition file where the queues are specified. So that we can be alerted whenever something goes wrong with the queues.

# Solution
Most IT people prefer Slack as comunication platfrom between teams, sending notification to a team Slack channel is a good why to integrate between alarting system and team comunication.

For definition file, I prefered to use 
<img width="50" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/yaml.png"/>

YAML is a human-readable structured data format. It is less complex and ungainly than XML or JSON, but provides similar capabilities. It essentially allows you to provide powerful configuration settings.

A team can define thier queues in this simple YAML format:
   ```YAML
   - team2:
     - test_devops_new_houses: 10
     - test_devops_edited_houses: x
     - test_devops_removed_houses: x
     - test_devops_new_houses_errors: 0
     - test_devops_edited_houses_errors: 0
     - test_devops_removed_houses_errors: 0
   ```
The ERROR queue will have limit value `0`, where you can use `x` for the queue you want to skip.

AWS Lambda function will run every minute to check the defined queue in the YAML file stored in [GITHUB](https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/blob/master/queues.yaml), where stakeholder can edit it easily.

# Setup

Setup steps:
- Create Slack App and allow it to post to a team channel.
- Create AWS Queues then IAM user and get the secret key.
- Edit the keys in Lambda source code.
- Create AWS function and delopy the code.
- Test it.

### First, let's start by creating a Slack App:
let's say your have the following Slack channels: `team1`, `team2`,`team3`; where the channel name is the same as your team name defined in the YAML file. if not, let's create one:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-1.png"/>

Then click on `+ Add an app`, or go to channel setting if didn't find the link:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-2.png"/>

This will open Slack Admin panel on the brwoser, you have to have admin permession on your Slack team to access it, click on `Build`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-3.png"/>

Click `Start Building` then `Create App`, chose your team and name the app `AWS-Watcher`; if you wish to have diffrent name you should change the name from the source code as well:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-4.png"/>

On `Basic Information` click `Incoming Webhooks` under `Add features and functionality`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-5.png"/>

Activate it by swiping to `On`, then click the bottom button `Add New Webhook to Workspace`
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-6.png"/>

Select your team channel, to allow the app to post on it:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-7.png"/>

Repeat the steps for all your teams defined in the YAML file, then copy all the Webhook URLs:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-8.png"/>

Go Back to `Basic Information`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-9.png"/>

Under `Display Information` add description, icon and backgorund color to your Slack App, then hit `Save Changes`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-10.png"/>

Finally, go back to your team Slack channel, you should see the integration message:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-11.png"/>

### Second, reate AWS Queues and the IAM user:

### Third, Add the keys to Lambda:

### Fourth, Create AWS function:

### Finally, Test:


brew install aws-cli

aws sqs list-queues

aws sqs send-message --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/test_devops_edited_houses_errors --message-body "this is an error message"  --message-attributes file://msg.json

aws sqs get-queue-attributes --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/edited_houses  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesDelayed ApproximateNumberOfMessagesNotVisible
