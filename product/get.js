'use strict';

const AWS = require('aws-sdk');
const headers = require('../utils/cors-header');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch product from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: headers,
        body: JSON.stringify({message : 'Couldn\'t fetch the product'})
      });
      return;
    }
    // create a response
    let response = {};

    if(result.Item){
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(result.Item),
      };      
    }else{
      response = {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({message : 'Product does not exist'})
      };
    }

    callback(null, response);
  });
};
