'use strict';

const AWS = require('aws-sdk');
const headers = require('../utils/cors-header');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.PRODUCT_TABLE,
};

module.exports.list = (event, context, callback) => {
  // fetch all products from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
          statusCode: error.statusCode || 501,
          headers: headers,
          body: JSON.stringify({message : 'Couldn\'t fetch the cart'})
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
