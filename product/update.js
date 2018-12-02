'use strict';

const AWS = require('aws-sdk');
const headers = require('../utils/cors-header');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  // validation
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
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#product_category': 'category',
      '#product_name': 'name'
    },
    ExpressionAttributeValues: {
      ':id': event.pathParameters.id,
      ':category': data.category,
      ':name': data.name,
      ':productPicUrl': data.productPicUrl,
      ':price': data.price,
      ':isImported': data.isImported
    },
    ConditionExpression: 'id = :id',
    UpdateExpression: 'SET #product_category = :category, #product_name = :name, productPicUrl = :productPicUrl, price = :price, isImported = :isImported',
    ReturnValues: 'ALL_NEW',
  };

  // update the product in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: headers,
        body: JSON.stringify({message : 'Couldn\'t update product'})
      });
      return;
    }

    // create a response
    callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Attributes),
    });
  });
};
