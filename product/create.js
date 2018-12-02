'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const headers = require('../utils/cors-header');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  
  const data = JSON.parse(event.body);

  if (typeof data.category !== 'string' || 
      typeof data.name !== 'string' || 
      typeof data.productPicUrl !== 'string' || 
      typeof data.price !== 'number' || 
      typeof data.isImported !== 'boolean'
      ) {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({message : 'Validation Failed'})
  });
    return;
  }

  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Item: {
      id: uuid.v1(),
      category: data.category,
      name: data.name,
      productPicUrl: data.productPicUrl,
      price: data.price,
      isImported: data.isImported
    },
  };

  // write product to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: headers,
        body: JSON.stringify({message : 'Couldn\'t create product'})
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
