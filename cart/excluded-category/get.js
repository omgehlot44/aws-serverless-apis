'use strict';

const excludedCategories = require('./excluded-categories');
const headers = require('../../utils/cors-header');

module.exports.get = (event, context, callback) => {

    // create a response
    let response = {
      statusCode: 200,
      headers : headers,
      body: JSON.stringify(excludedCategories)
    };

    callback(null, response);
};