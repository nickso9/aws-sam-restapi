import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";

const DYNAMODB_URI = "http://localhost:8000";
const TABLE_NAME = "posts"
const dynamoDB = new DynamoDBClient({ endpoint: DYNAMODB_URI });

async function init() {
    try {
        await dynamoDB.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
        console.log(`${TABLE_NAME} already exists.`);
        await dynamoDB.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
        console.log(`${TABLE_NAME} has been deleted.`);
        await createTable();
        console.log(`${TABLE_NAME} has been created.`);
    } catch (error) {
        try {
            await createTable();
            console.log(`${TABLE_NAME} has been created.`);
        } catch (err) {
            console.log('error', error.message, err.message);   
        }
    }
}

/*
DynamoDB is schemaless: When you create a table in DynamoDB, you specify only the primary key attributes,
such as partition key or partition key and sort key.
*/

async function createTable() {
    try {
        const command = new CreateTableCommand(postTableInputs());
        return await dynamoDB.send(command);
    } catch (error) {
        console.log('error', error.message);
    }
}

function postTableInputs() {
    const input = {
        "AttributeDefinitions": [
            {
                "AttributeName": "Arthur",
                "AttributeType": "S"
            },
            {
                "AttributeName": "Title",
                "AttributeType": "S"
            }
        ],
        "KeySchema": [
            {
                "AttributeName": "Arthur",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "Title",
                "KeyType": "RANGE"
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableName": TABLE_NAME
    };

    return input;
}


init();