'use strict';

if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));
}
var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1'

const BOT_NAME= process.env.bot_name
const INSTANCE_ID = process.env.instance
const params = {
  InstanceIds: [
    INSTANCE_ID
  ]
};

var response;

var ec2Start = function ec2Start() {
  var ec2 = new AWS.EC2();
  return ec2.startInstances(params).promise();
}

var ec2Stop = function ec2Stop() {
  var ec2 = new AWS.EC2();
  return ec2.stopInstances(params).promise();
}

var ec2Status = function ec2Status() {
  var ec2 = new AWS.EC2();
  return ec2.describeInstances(params).promise();
}

var createResponse = (text) => {
  var response = {
    statusCode: 200,
    body: JSON.stringify({
      text: text,
    }),
  };
  return response
}

module.exports.hello = (event, context, callback) => {
  // deploy stop
  const findText = val => (val.match(/^text=(.*)$/));
  const text = event.body.split('&').filter(findText)[0];
  const decodeText = decodeURIComponent(text.split('=')[1]);
  const reg = new RegExp('^' + BOT_NAME + '\\+(.*)$')
  const subcommand = decodeText.match(reg)[1];

  if (subcommand == 'start') {
    ec2Start()
      .then((response) => {
        response = createResponse(JSON.stringify(response))
        console.log(response)
        callback(null, response);
      })
      .catch((error) => {
        response = createResponse(JSON.stringify(error))
        console.log(error)
        callback(null, response);
      });
  } else if (subcommand == 'stop') {
    ec2Stop()
      .then((response) => {
        response = createResponse(JSON.stringify(response))
        console.log(response)
        callback(null, response);
      })
      .catch((error) => {
        response = createResponse(JSON.stringify(error))
        console.log(error)
        callback(null, response);
      });
  } else if (subcommand == 'status') {
    ec2Status()
      .then((response) => {
        response = createResponse(JSON.stringify(response))
        console.log(response)
        callback(null, response);
      })
      .catch((error) => {
        response = createResponse(JSON.stringify(error))
        console.log(error)
        callback(null, response);
      });
  } else {
        response = createResponse("usage: <bot_name> <subcommand>.\nstart/stop/status")
        console.log(response)
        callback(null, response);
  }
};
