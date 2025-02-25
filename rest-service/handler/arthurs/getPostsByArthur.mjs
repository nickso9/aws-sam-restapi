import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    ScanCommand
} from "@aws-sdk/client-dynamodb";


const dynamoDB = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_URI
});

const TABLE_NAME_POSTS = process.env.TABLE_NAME_POSTS;
const TABLE_NAME_ARTHURS = process.env.TABLE_NAME_ARTHURS;

export const getPostsByArthur = async (event, context) => {

    const arthurId = event.pathParameters?.id;
    
    try {
        const postParams = {
            TableName: TABLE_NAME_POSTS,
            FilterExpression: "arthurId = :a",
            ExpressionAttributeValues: {
                ":a": { "S": arthurId }
            },
            ProjectionExpression: "id, title, message, arthurId"
        };
 
        const postCommand = new ScanCommand(postParams);
        const postData = await dynamoDB.send(postCommand);

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