import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    GetItemCommand
} from "@aws-sdk/client-dynamodb";


const dynamoDB = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const getArthurById = async (event, context) => {

    const arthurId = event.pathParameters?.id;

    try {
        const params = {
            TableName: TABLE_NAME_ARTHURS,
            "Key": {
                "id": {
                    "S": arthurId
                }
            }
        };

        const command = new GetItemCommand(params);
        const data = await dynamoDB.send(command);

        if (!data.Item?.id) {
            return {
                statusCode: 200,
                body: JSON.stringify([]),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};