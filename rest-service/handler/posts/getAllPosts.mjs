import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ScanCommand,
  BatchGetItemCommand
} from "@aws-sdk/client-dynamodb";

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
      postArthursId.add(post.arthurId.S);
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
      post.arthurName = {} 
      post.arthurName.S = arthurMap[post.arthurId.S] || "Arthur not available.";
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