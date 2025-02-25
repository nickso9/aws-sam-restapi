import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const getArthurs = async (event, context) => {
    
    const params = {
        TableName: TABLE_NAME_ARTHURS,
        Limit: 100
      };

  try {
    const scanCommand = new ScanCommand(params);
    const data = await dynamoDB.send(scanCommand);

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items), 
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};