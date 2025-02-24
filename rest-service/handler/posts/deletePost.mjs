import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteItemCommand
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_POSTS = process.env.TABLE_NAME_POSTS;

export const deletePost = async (event, context) => {

  const postId = event.pathParameters?.id;

  if (!postId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
    };
  }

  const input = {
    "Key": {
      "id": {
        "S": postId
      }
    },
    "TableName": TABLE_NAME_POSTS
  }

  try {
    const command = new DeleteItemCommand(input);
    const response = await dynamoDB.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};