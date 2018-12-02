'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const headers = require('../utils/cors-header');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  
  const params = {
    TableName: process.env.CART_TABLE,
    Item: {
      id: uuid.v1(),
      products: []
    },
  };

  // write the cart to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: headers,
        body: JSON.stringify({message : 'Couldn\'t create cart'})
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};
