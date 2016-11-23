'use strict';

const INSTANCE_ID = process.env.instance

var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1'

function ec2Start(cb){
  var ec2 = new AWS.EC2();
  var params = {
      InstanceIds: [
        INSTANCE_ID
      ]
  };

  console.log('starting ec2');

  ec2.startInstances(params, function(err, data) {
      if (!!err) {
          console.log(err, err.stack);
      } else {
        cb();
      }
  });
}

function ec2Stop(cb){
  var ec2 = new AWS.EC2();
  var params = {
      InstanceIds: [
        INSTANCE_ID
      ]
  };

  console.log('stopping ec2');

  ec2.stopInstances(params, function(err, data) {
      if (!!err) {
          console.log(err, err.stack);
      } else {
        cb();
      }
  });
}

function ec2Status(cb){
  var ec2 = new AWS.EC2();
  var params = {
      InstanceIds: [
        INSTANCE_ID
      ]
  };

  console.log('status ec2');

  ec2.describeInstances(params, function(err, data) {
      if (!!err) {
        console.log(err, err.stack);
      } else {
        cb();
      }
  });
}

module.exports.hello = (event, context, callback) => {
  // リクエストをparseする
  // deploy
  const findText = val => (val.match(/^text=(.*)$/));
  const text = event.body.split('&').filter(findText)[0];
  const decodeText = decodeURIComponent(text.split('=')[1]);
  const subcommand = decodeText.match(/deploy\+(.*)$/)[1];

  console.log(subcommand)
  if (subcommand == 'start') {
    ec2Start(function() {
      console.log('start')
    });
    var response = {
      statusCode: 200,
      body: JSON.stringify({
        text: 'start',
        input: event,
      }),
    };
  } else if (subcommand == 'stop') {
    ec2Stop(function() {
      console.log('stop')
    });
    var response = {
      statusCode: 200,
      body: JSON.stringify({
        text: 'stop',
        input: event,
      }),
    };
  } else if (subcommand == 'status') {
    ec2Status(function() {
      console.log('status')
    });
    var response = {
      statusCode: 200,
      body: JSON.stringify({
        text: 'status',
        input: event,
      }),
    };
  } else {
    // 何もしない
    var response = {
      statusCode: 500,
      body: JSON.stringify({
        text: 'this command is not implemeted',
        input: event,
      }),
    };
  }

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
