import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  // GetItemCommand,
  // UpdateItemCommand,
  // DeleteItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME = process.env.TABLE_NAME;

export const getAllPosts = async (event, context) => {

  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const data = await dynamoDB.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items), // Returns all items
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};


export const getPostByArthur = async (event, context) => {

  const searchName = event.pathParameters.arthur;

  const params = {
    TableName: TABLE_NAME,
    ProjectionExpression: "Arthur, Title, Message", // Select specific attributes to fetch
    FilterExpression: "contains(Arthur, :searchName)", // Filter for names containing 'Bob'
    ExpressionAttributeValues: {
      ":searchName": { "S": searchName.toLowerCase() }
    }
  };

  try {
    const command = new ScanCommand(params)
    const data = await dynamoDB.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items), // Returns all items
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const createPost = async (event, context) => {
  const postInput = JSON.parse(event.body);

  if (!postInput?.arthur || !postInput?.title || !postInput?.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
    };
  }
  const params = {
    TableName: TABLE_NAME,
    Item: {
      "Message": {
        "S": postInput.message
      },
      "Arthur": {
        "S": postInput.arthur
      },
      "Title": {
        "S": postInput.title
      },
    }
  }

  try {
    const command = new PutItemCommand(params)
    const response = await dynamoDB.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};