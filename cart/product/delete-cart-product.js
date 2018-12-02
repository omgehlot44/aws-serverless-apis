'use strict';

const AWS = require('aws-sdk');
const headers = require('../../utils/cors-header');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  
  dynamoDb.get(
    {
        TableName: process.env.CART_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    }, 
    (error, cartResult) => {
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

        if(!cartResult.Item){
            callback(null, {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({message : 'Cart does not exist'})
              });
            return;
        }

        //find index of product to remove
        let index;
        cartResult.Item.products.every((cartProduct,i) => {
            if(cartProduct.product.id === event.pathParameters.productId){
                index = i;
                return false;
            }
            return true;
        });

        
        if(typeof index === 'undefined'){
            callback(null, {
                statusCode: 404,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Product does not exist in Cart',
              });
            return;            
        }

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
                UpdateExpression: 'REMOVE #products['+index+']',
                ReturnValues: 'ALL_NEW',
            }
            , (error) => {
                // handle potential errors
                if (error) {
                    console.error(JSON.stringify(error, null, 2));
                    
                    callback(null, {
                        statusCode: error.statusCode || 501,
                        headers: headers,
                        body: JSON.stringify({message : 'Couldn\'t remove product from cart'})
                    });
                    return;
                }

                callback(null, {
                    statusCode: 200,
                    headers: headers,
                    body: JSON.stringify({ok : true})
                });
        });
    });
};
