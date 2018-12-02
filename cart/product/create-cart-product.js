'use strict';

const AWS = require('aws-sdk');
const headers = require('../../utils/cors-header');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  
  const data = JSON.parse(event.body);

  if (typeof data.productId !== 'string'
      ) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({message : 'Validation Failed'})
        });
    return;
  }

  dynamoDb.get(
    {
        TableName: process.env.PRODUCT_TABLE,
        Key: {
        id: data.productId,
        },
    }, 
    (error, productResult) => {
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

        if(!productResult.Item){
            callback(null, {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({message : 'Product does not exist'})
              });
            return;
        }

        let cartProduct = [{
            product : productResult.Item,
            quantity : 1
        }];

        //Add cartProduct to product list in cart
        dynamoDb.update(
            {
                TableName: process.env.CART_TABLE,
                Key: {
                  id: event.pathParameters.id,
                },
                ExpressionAttributeNames: {
                  '#products': 'products'
                },
                ExpressionAttributeValues: {
                  ':cartProduct': cartProduct
                },
                UpdateExpression: 'SET #products = list_append(#products, :cartProduct)',
                ReturnValues: 'ALL_NEW',
            }
            , (error) => {
                // handle potential errors
                if (error) {
                    console.error(JSON.stringify(error, null, 2));
                    
                    callback(null, {
                        statusCode: error.statusCode || 501,
                        headers: headers,
                        body: JSON.stringify({message : 'Couldn\'t add product to cart'})
                    });
                    return;
                }

                callback(null, {
                    statusCode: 200,
                    headers: headers,
                    body: JSON.stringify(cartProduct[0].product),
                });
        });
    });
};
