import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  // GetItemCommand,
  UpdateItemCommand,
  // DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

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
    ProjectionExpression: "arthur, title, message", // Select specific attributes to fetch
    FilterExpression: "contains(arthur, :searchName)",
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

  const id = uuidv4();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      "id": {
        "S": id
      },
      "message": {
        "S": postInput.message
      },
      "arthur": {
        "S": postInput.arthur
      },
      "title": {
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

export const editPost = async (event, context) => {
  const postInput = JSON.parse(event.body);

  if (!postInput?.id || !postInput?.arthur || !postInput?.title || !postInput?.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
    };
  }
  // console.log(postInput);
  const input = {
    "ExpressionAttributeNames": {
      "#T": "title",
      "#M": "message",
      "#A": "arthur"
    },
    "ExpressionAttributeValues": {
      ":t": {
        "S": postInput.title
      },
      ":m": {
        "S": postInput.message
      },
      ":a": {
        "S": postInput.arthur
      }
    },
    "Key": {
      "id": { "S": postInput.id }
    },
    "ReturnValues": "ALL_NEW",
    "TableName": TABLE_NAME,
    "UpdateExpression": "SET #T = :t, #M = :m, #A = :a",
    "ConditionExpression": "attribute_exists(id)"  // Prevents creating a new item
  };
  // console.log(input)
  try {
    const command = new UpdateItemCommand(input);
    // console.log(command);
    const response = await dynamoDB.send(command);
    // console.log(response)
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};