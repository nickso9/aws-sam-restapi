import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    PutItemCommand
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const dynamoDB = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const createArthur = async (event, context) => {
    const arthurInput = JSON.parse(event.body);

    if (!arthurInput?.name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
        };
    }

    try {
        const id = uuidv4();

        const params = {
            TableName: TABLE_NAME_ARTHURS,
            Item: {
                "id": {
                    "S": id
                },
                "name": {
                    "S": arthurInput.name
                }
            }
        }

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