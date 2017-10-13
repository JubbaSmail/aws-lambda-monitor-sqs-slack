# aws-lambda-monitor-sqs-slack
AWS Lambda function to monitor SQS queue to a Slack channel

<img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/sqs.png"/>   <img width="100" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/arrow.png"/>  <img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/lambda.png"/>   <img width="100" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/arrow.png"/>   <img width="200" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/slack.png"/>

# Problem:

There are some SQS queues on amazon (+/- 10 queues, but the number of queues is growing every month). Queues are for different applications, different teams, and have different characteristics (error queues, different purposes, different thresholds etc.). The teams are responsible for adding new queues and specifying which queues are applicable to be monitored.

As a DevOps team we would like to monitor these queues by providing an automation solution which creates a monitor per queue according to a definition file where the queues are specified. So that we can be alerted whenever something goes wrong with the queues.

# Solution
Most IT people prefer Slack as a communication platform between teams, sending a notification to a team Slack channel is a good way to integrate between the alarting system and team comunication.

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
- Create AWS Lambda function and delopy the code.
- Test it.

### First, let's start by creating a Slack App:
1. let's say you have the following Slack channels: `team1`, `team2`,`team3`; where the channel name is the same as your team name defined in the YAML file. if not, let's create one:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-1.png"/>

2. Then click on `+ Add an app`, or go to channel setting if you didn't find the link:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-2.png"/>

3. This will open Slack Admin panel on the browser; you have to have admin permission on your Slack team to access it, click on `Build`:

<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-3.png"/>

4. Click `Start Building` then `Create App`, chose your team and name the app `AWS-Watcher`; if you wish to have a diffrent name you should change the name in the source code as well:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-4.png"/>

5. On `Basic Information` click `Incoming Webhooks` under `Add features and functionality`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-5.png"/>

6. Activate it by swiping to `On`, then click the bottom button `Add New Webhook to Workspace`
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-6.png"/>

7. Select your team channel, to allow the app to post on it:

<img width="400" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-7a.png"/>

8. Repeat the steps for all your teams defined in the YAML file, then copy all the Webhook URLs, we gonna use it in Lambda source code:

<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-8.png"/>

9. Go Back to `Basic Information`:

<img width="250" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-9.png"/>

10. Under `Display Information` add description, icon and backgorund color to your Slack App, then hit `Save Changes`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-10.png"/>

11. Finally, go back to your team Slack channel, you should see the integration message:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s1-11.png"/>

### Second, create AWS Queues and the IAM user:
1. On AWS Console, select a region, then `SQS` and create your queues:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s2-1.png"/>

2. Again on AWS Console, go to `IAM`, and create a new user with `Programmatic access`:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s2-2.png"/>

3. Click Next, select `Attach exisiting policies directly`, search for `sqs`, then select `AmazonSQSFullAccess`, this will allow this user to access the queues:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s2-3.png"/>

4. Click Next, copy the Access Key ID and Secret access key, we gonna use them in AWS Lambda function:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s2-4.png"/>

### Third, Add the keys to Lambda:
1. Clone or Download this repo, open `index.js`, on top of the file you need to edit the variables of Slack Webhook URL and AWS keys:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s3-1.png"/>

### Fourth, Create and Deploy AWS Lambda function:
1. On AWS Console, select a region, go to Lambda, click on `Author from scratch`: 
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-1.png"/>

2. Name the function `monitor-sqs-slack`, select `Choose an existing role` on Role, and `service-role/sqspoller` for Existing role, then hit `Create function`:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-2.png"/>

3. Compress the file `index.js` and the directory `node_modules` to a zip file:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-4.png"/>

4. Back to AWS console, on `Code entry type`, select `Upload a .ZIP file`, select the ZIP file from your machine:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-3.png"/>

5. On `Triggers`, click, `Add trigger`:
<img width="500" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-6.png"/>

6. On `Rule`, select `Create a new rule`, for `Rule name` type `everymin`, for `Rule type` choose `Schedule expression`, type `rate(1 minute)`, then click `Submit`:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-7.png"/>

7. Click `Save`:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s4-5.png"/>

Congrats, you are ready to test now!!

### Finally, Test:
You can test using AWS Console or AWS CLI, I will show you how to test using the CLI:
1. Download `aws-cli`, on Mac OS X, you can type this command if you have [Brew](https://brew.sh)
```bash
brew install aws-cli
```
2. Add AWS secret keys to aws cli:
```bash
aws configure
```
3. Check if you can list SQS queues:
```bash
aws sqs list-queues
```
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s5-1.png"/>

4. Try to send message to one of the ERROR queues:
```bash
aws sqs send-message --queue-url https://eu-west-1.queue.amazonaws.com/223381404055/test_devops_edited_houses_errors --message-body "this is an error message"  --message-attributes file://msg.json
```
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s5-2.png"/>

5. In a minute, your should see the alert on your team Slack channel:
<img width="900" src="https://github.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/raw/master/imgs/s5-3.png"/>


## beautiful, isn't it !!
