'use strict';

var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';

var ec2 = new AWS.EC2();

const INSTANCE_ID = process.env.instance
const params = {
  InstanceIds: [
    INSTANCE_ID
  ]
};

module.exports.ec2Start = (event, context, callback) => {
  console.log('start')
  ec2.startInstances(params).promise()
    .then((response) => {
      callback(null, response);
    })
    .catch((error) => {
      console.log(error)
      callback(null, error);
    });
};

module.exports.ec2Stop = (event, context, callback) => {
  console.log('stop')
  ec2.stopInstances(params).promise()
    .then((response) => {
      callback(null, response);
    })
    .catch((error) => {
      console.log(error)
      callback(null, error);
    });
};
