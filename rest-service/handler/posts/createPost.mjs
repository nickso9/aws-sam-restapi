import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    PutItemCommand,
    GetItemCommand
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const dynamoDB = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_POSTS = process.env.TABLE_NAME_POSTS;
const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const createPost = async (event, context) => {
    const postInput = JSON.parse(event.body);

    if (!postInput?.arthurId || !postInput?.title || !postInput?.message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad Request: Missing required properties" }),
        };
    }

    try {

        const checkArthurParams = {
            TableName: TABLE_NAME_ARTHURS,
            "Key": {
                "id": {
                    "S": postInput.arthurId
                }
            }
        };
        
        const commandArthur = new GetItemCommand(checkArthurParams);
        const arthurData = await dynamoDB.send(commandArthur);

        if (!arthurData.Item?.id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Arthur doesn't exist." }),
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
                "arthurId": {
                    "S": postInput.arthurId
                },
                "title": {
                    "S": postInput.title
                },
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