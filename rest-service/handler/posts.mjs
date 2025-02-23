import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  // QueryCommand,
  BatchGetItemCommand
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const dynamoDB = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_POSTS = process.env.TABLE_NAME_POSTS;
const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const getAllPosts = async (event, context) => {

  try {
    const postParams = {
      TableName: TABLE_NAME_POSTS,
      Limit: 100
    };

    const scanCommand = new ScanCommand(postParams);
    const postData = await dynamoDB.send(scanCommand);

    if (!postData.Items.length) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    let postArthursId = new Set();

    for (let i = 0; i < postData.Items.length; i++) {
      const post = postData.Items[i];
      postArthursId.add(post.arthur.S);
    }

    const arthurParams = {
      RequestItems: {
        [TABLE_NAME_ARTHURS]: {
          Keys: [],
          AttributesToGet: [
            'id', 'name'
          ]
        }
      }
    }

    const keys = arthurParams.RequestItems[TABLE_NAME_ARTHURS].Keys;
    for (const id of postArthursId) {
        keys.push({
          id: {
           "S": id
          }
        })
    }

    const queryCommand = new BatchGetItemCommand(arthurParams);
    const arthurData = await dynamoDB.send(queryCommand);
    
    const arthurs = arthurData.Responses.arthurs;
    const arthurMap = {};

    for (let i = 0; i < arthurs.length; i++) {
      const arthur = arthurs[i];
      arthurMap[arthur["id"]["S"]] = arthur["name"]["S"];
    }

    for (let i = 0; i < postData.Items.length; i++) {
      const post = postData.Items[i];
      post.arthur.S = arthurMap[post.arthur.S];
    }

    return {
      statusCode: 200,
      body: JSON.stringify(postData.Items),
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
      TableName: TABLE_NAME_POSTS,
      "Key": {
        "id": {
          "S": postId
        }
      }
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDB.send(command);
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
    TableName: TABLE_NAME_POSTS,
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

  if (!postId || !postInput?.title || !postInput?.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
    };
  }
  // console.log(postInput);
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
    // console.log(error)
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