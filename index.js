


console.log('[AWS SQS Monitor]');

/*
 configuration for each condition.
 add any conditions here
*/
// var ALARM_CONFIG = [
// 	{
// 		condition: "OK",
// 		channel: "#cloudwatch",
// 		mention: "<@here>",
// 		color: "#21ff9f",
// 		severity: "INFO"
// 	},
// 	{
// 		condition: "ALARM",
// 		channel: "#cloudwatch",
// 		mention: "<@here>",
// 		color: "#F35A00",
// 		severity: "CRITICAL"
// 	}
	
// ];

// var SLACK_CONFIG = {
// 	path: "/YOUR_PATH",
// };

yaml = require('js-yaml');
//var ymal = require('yamljs');
var fs = require('fs');
var http = require ('https');
var querystring = require ('querystring');


var sqs_file = "/tmp/" + Date.now() + ".yaml";
var sqs_webfile = "https://raw.githubusercontent.com/Ismail-AlJubbah/aws-lambda-monitor-sqs-slack/master/queues.yaml";

exports.handler = function(event, context) {
 
    fs.exists(sqs_file, function(exists) {
        if(exists) {
          console.log("File exists. Deleting now ...");
          fs.unlink(sqs_file);
        } 
        var file = fs.createWriteStream(sqs_file);
        var request = http.get(sqs_webfile, function(response) {
            response.pipe(file);
            //nativeObject = ymal.load('/tmp/queues.yaml');
            file.on('finish', function() {
              console.log("YAML loaded::");
              try {
                var doc = yaml.safeLoad(fs.readFileSync(sqs_file, 'utf8'));
                console.log(doc);
              } catch (e) {
                console.log("ERROR::");
                console.log(e);
              }
              //console.log(nativeObject);
              context.done(null, 'done!');
            });
            
          });
      });
	//console.log(event.Records[0]);

	// parse information
	// var message = event.Records[0].Sns.Message;
	// var subject = event.Records[0].Sns.Subject;
	// var timestamp = event.Records[0].Sns.Timestamp;

	// // vars for final message
	// var channel;
	// var severity;
	// var color;

	// // create post message
	// var s1 = subject.split(' ');
	// var s2 = s1[1].split('awsroute53');
	// var alarmMessage = "`"+s2[0]+"`";

	// // check subject for condition
	// for (var i=0; i < ALARM_CONFIG.length; i++) {
	// 	var row = ALARM_CONFIG[i];
	// 	console.log(row);
	// 	if (subject.match(row.condition)) {
	// 		console.log("Matched condition: "+row.condition);
    //         		if(row.condition=="ALARM")
	// 		    alarmMessage = row.mention+": "+alarmMessage+" "+" is not responding for the last 5 mins.\n";
	// 		else if(row.condition=="OK")
	// 		    alarmMessage = row.mention+": "+alarmMessage+" "+" is up now.\n";
	// 		else
	// 		    alarmMessage = alarmMessage;
	// 		channel = row.channel;
	// 		severity = row.severity;
	// 		color = row.color;
	// 		break;
	// 	}
	// }

	// if (!channel) {
	// 	console.log("Could not find condition.");
	// 	context.done('error', "Invalid condition");
	// }

	// var payloadStr = JSON.stringify({
	// "attachments": [
	// 	{
	// 		"fallback": alarmMessage,
	// 		"text": alarmMessage,
	// 		"mrkdwn_in": ["text"],
	// 		"username": "AWS-CloudWatch",
	// 		"color": color
	// 	}
	// ],
	// 	"channel":channel
	// });
	// var postData = querystring.stringify({
	//   "payload": payloadStr
	// });
	// console.log(postData);
	// var options = {
	// 	hostname: "hooks.slack.com",
	// 	port: 443,
	// 	path: SLACK_CONFIG.path,
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/x-www-form-urlencoded',
	// 		'Content-Length': postData.length
	// 	}
	// };

	// var req = http.request(options, function(res) {
	// 	console.log("Got response: " + res.statusCode);
	// 	res.on("data", function(chunk) {
	// 		console.log('BODY: '+chunk);
	// 		context.done(null, 'done!');
	// 	});
	// }).on('error', function(e) {
	// 	context.done('error', e);
	// });
	// req.write(postData);
	// req.end();
};