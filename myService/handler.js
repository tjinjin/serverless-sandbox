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

var ec2 = new AWS.EC2();
var response;

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
    ec2.startInstances(params).promise()
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
    ec2.stopInstances(params).promise()
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
    ec2.describeInstances(params).promise()
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
