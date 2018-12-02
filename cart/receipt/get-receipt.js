'use strict';

const AWS = require('aws-sdk');
const headers = require('../../utils/cors-header');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const excludedCategories = require('../excluded-category/excluded-categories');

module.exports.get = (event, context, callback) => {
  
  if (typeof event.pathParameters.id !== 'string') {
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

        let reciept = {
            totalPrice : 0.0,
            totalTax : 0.0,
            grandTotal : 0.0
          };

        cartResult.Item.products.forEach(cartProduct => {
            // Calculate Basic Sales Tax
            if (excludedCategories.indexOf(cartProduct.product.category) === -1) {
              cartProduct.salesTax  = (0.05 * Math.ceil(cartProduct.product.price * 0.1 / 0.05)) * cartProduct.quantity;
            } else {
              cartProduct.salesTax = 0;
            }
            // Calculate Import Duty
            if (cartProduct.product.isImported) {
              cartProduct.importDuty  = (0.05 * Math.ceil(cartProduct.product.price * 0.05 / 0.05)) * cartProduct.quantity;
            } else {
              cartProduct.importDuty = 0;
            }
    
            // Calculate Amount
            cartProduct.totalAmount = (cartProduct.product.price * cartProduct.quantity) + cartProduct.importDuty + cartProduct.salesTax;
    
            let totalTax = cartProduct.importDuty + cartProduct.salesTax;
    
            reciept.totalPrice +=cartProduct.product.price;
            reciept.totalTax += totalTax;
            reciept.grandTotal += cartProduct.totalAmount;
        });
    
        reciept.totalPrice =reciept.totalPrice.toFixed(2);
        reciept.totalTax = reciept.totalTax.toFixed(2);
        reciept.grandTotal = reciept.grandTotal.toFixed(2);

        callback(null, {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(reciept)
        });
    });
};
