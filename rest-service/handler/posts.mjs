import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
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

export const getPostById = async (event, context) => {

  const postId = event.pathParameters?.id;

  if (!postId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
    };
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      "Key": {
        "id": {
          "S": postId
        }
      }
    };

    console.log(params)

    const command = new GetItemCommand(params);
    const response = await dynamoDB.send(command);
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Item), // Returns all items
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
      statusCode: 201,
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
  const postId = event.pathParameters?.id;

  if (!postId || !postInput?.arthur || !postInput?.title || !postInput?.message) {
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
      "id": { "S": postId }
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
      statusCode: 204,
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
    "TableName": TABLE_NAME
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