import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetItemCommand
} from "@aws-sdk/client-dynamodb";


const dynamoDB = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_POSTS = process.env.TABLE_NAME_POSTS;
const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const getPostById = async (event, context) => {

  const postId = event.pathParameters?.id;

  try {
    const postParams = {
      TableName: TABLE_NAME_POSTS,
      "Key": {
        "id": {
          "S": postId
        }
      }
    };

    const postCommand = new GetItemCommand(postParams);
    const postData = await dynamoDB.send(postCommand);
    
    if (!postData.Item?.id) {
      return {
        statusCode: 200,
        body: JSON.stringify([]), 
      };
    }

    const arthurParams = {
      TableName: TABLE_NAME_ARTHURS,
      "Key": {
        "id": {
          "S": postData.Item.arthurId.S
        }
      }
    };

    const arthurCommand = new GetItemCommand(arthurParams);
    const arthurData = await dynamoDB.send(arthurCommand);

    postData.Item.arthurName = {}
    postData.Item.arthurName.S = arthurData.Item?.name?.S || "Arthur not available.";

    return {
      statusCode: 200,
      body: JSON.stringify(postData.Item), 
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};