# Take Home Exercise - Serverless REST APIs

This project is developed using **Serverless Framework** with **AWS** as Compute Provider.

**NodeJS 8.10** is used for API development.

Following AWS Services are being used in this project:

* **AWS CloudFormation**
* **AWS S3**
* **AWS ApiGateway**
* **AWS Lamda**
* **AWS CloudWatch**
* **AWS DynamoDB**
* **AWS IAM**

## Setup

```bash
npm install
```

## Deploy

In order to deploy the endpoint simply run

```bash
serverless deploy
```

## Rest End Points

```bash

Product :   

    POST - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/product
    GET - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/product
    GET - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/product/{id}
    PUT - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/product/{id}
    DELETE - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/product/{id}

Cart :   

    POST - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart
    GET - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/{id}
    DELETE - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/{id}
    POST - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/{id}/product
    DELETE - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/{id}/product/{productId}
    PUT - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/{id}/product/product-quantity
    GET - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/excluded-category
    GET - https://uamr95dj89.execute-api.us-east-1.amazonaws.com/dev/cart/{id}/receipt

```
