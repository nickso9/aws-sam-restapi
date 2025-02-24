import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_POSTS = process.env.TABLE_NAME_POSTS;

export const editPost = async (event, context) => {
  const postInput = JSON.parse(event.body);
  const postId = event.pathParameters?.id;

  if (!postId || !postInput?.title || !postInput?.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
    };
  }
 
  const input = {
    "ExpressionAttributeNames": {
      "#T": "title",
      "#M": "message"
    },
    "ExpressionAttributeValues": {
      ":t": {
        "S": postInput.title
      },
      ":m": {
        "S": postInput.message
      }
    },
    "Key": {
      "id": { "S": postId }
    },
    "ReturnValues": "ALL_NEW",
    "TableName": TABLE_NAME_POSTS,
    "UpdateExpression": "SET #T = :t, #M = :m",
    "ConditionExpression": "attribute_exists(id)"  // Prevents creating a new item
  };
 
  try {
    const command = new UpdateItemCommand(input);
    const response = await dynamoDB.send(command);

    return {
      statusCode: 204,
      body: JSON.stringify(response),
    };
  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};