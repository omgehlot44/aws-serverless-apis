'use strict';

const AWS = require('aws-sdk');
const headers = require('../../utils/cors-header');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateQuantity = (event, context, callback) => {
  
  const data = JSON.parse(event.body);

  if (typeof data.productId !== 'string' || 
      typeof data.action !== 'string'
      ) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({message : 'Validation Failed'})
        });
        return;
  }

  //check if action is valid
  if( !(data.action == "increase" || data.action == "decrease") ) {
        console.error('Invalid Action');
        callback(null, {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({message : 'Invalid Action'})
        });
        return;
  }

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
            if(cartProduct.product.id === data.productId){
                index = i;
                return false;
            }
            return true;
        });

        
        if(typeof index === 'undefined'){
            callback(null, {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({message : 'Product does not exist in Cart'})
              });
            return;            
        }

        let counter = 1;
        if(data.action == "decrease")
            counter = -1;

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
                  ':counter': counter,
                  ':minQuantity' : 1
                },
                UpdateExpression: 'SET #products['+index+'].quantity = #products['+index+'].quantity + :counter',
                ConditionExpression : '#products['+index+'].quantity > :minQuantity OR :counter = :minQuantity',
                ReturnValues: 'ALL_NEW',
            }
            , (error) => {
                // handle potential errors
                if (error) {
                    console.error(JSON.stringify(error, null, 2));                    
                    callback(null, {
                        statusCode: error.statusCode || 501,
                        headers: headers,
                        body: JSON.stringify({message : 'Couldn\'t increase quantity'})
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
