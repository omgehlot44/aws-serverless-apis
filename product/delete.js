'use strict';

const AWS = require('aws-sdk');
const headers = require('../utils/cors-header');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // delete the product from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: headers,
        body: JSON.stringify({message : 'Couldn\'t remove the product item'})
      });
      return;
    }

    // create a response
    callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ok : true})
    });
  });
};
