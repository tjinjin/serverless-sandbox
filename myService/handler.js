'use strict';

if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));
}
var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1'

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

module.exports.hello = (event, context, callback) => {
  // deploy stop
  const findText = val => (val.match(/^text=(.*)$/));
  const text = event.body.split('&').filter(findText)[0];
  const decodeText = decodeURIComponent(text.split('=')[1]);
  const subcommand = decodeText.match(/ec2-police\+(.*)$/)[1];

  if (subcommand == 'start') {
    ec2Start()
      .then((response) => {
        var response = {
          statusCode: 200,
          body: JSON.stringify({
            text: response.StatingInstances[0].CUrrentState.pending,
          }),
        };
        console.log(response)
        callback(null, response);
      })
      .catch((error) => {
        var response = {
          statusCode: 200,
          body: JSON.stringify({
            text: 'message: ' + error.message + ' code: ' + error.code,
          }),
        };
        console.log(error)
        callback(null, response);
      });
  } else if (subcommand == 'stop') {
    ec2Stop()
      .then((response) => {
        var response = {
          statusCode: 200,
          body: JSON.stringify({
            text: response.StoppingInstances[0].CurrentState.Name,
          }),
        };
        console.log(response)
        callback(null, response);
      })
      .catch((error) => {
        var response = {
          statusCode: 200,
          body: JSON.stringify({
            text: 'message: ' + error.message + ' code: ' + error.code,
          }),
        };
        console.log(error)
        callback(null, response);
      });
  } else if (subcommand == 'status') {
    ec2Status()
      .then((response) => {
        var response = {
          statusCode: 200,
          body: JSON.stringify({
            text: 'CurrentStatus: ' + response.Reservations[0].Instances[0].State.Name,
          }),
        };
        console.log(response)
        callback(null, response);
      })
      .catch((error) => {
        var response = {
          statusCode: 200,
          body: JSON.stringify({
            text: 'message: ' + error.message + ' code: ' + error.code,
          }),
        };
        console.log(error)
        callback(null, response);
      });
  } else {
    var response = {
      statusCode: 200,
      body: JSON.stringify({
        text: "usage: <bot_name> <subcommand>.\nstart/stop/status",
      }),
    };
    callback(null, response)
  }
};
