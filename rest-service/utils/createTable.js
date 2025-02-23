import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";

const DYNAMODB_URI = "http://localhost:8000";
const TABLE_NAME_POSTS = "posts";
const TABLE_NAME_ARTHURS = "arthurs";
const dynamoDB = new DynamoDBClient({ endpoint: DYNAMODB_URI });


async function init() {
    await initArthurTable();
    await initPostTable();
    console.log('done');
}

async function initArthurTable() {
    try {
        await dynamoDB.send(new DescribeTableCommand({ TableName: TABLE_NAME_ARTHURS }));
        console.log(`${TABLE_NAME_ARTHURS} already exists.`);
        await dynamoDB.send(new DeleteTableCommand({ TableName: TABLE_NAME_ARTHURS }));
        console.log(`${TABLE_NAME_ARTHURS} has been deleted.`);
        await createTable(TABLE_NAME_ARTHURS);
        console.log(`${TABLE_NAME_ARTHURS} has been created.`);
    } catch (error) {
        try {
            await createTable(TABLE_NAME_ARTHURS);
            console.log(`${TABLE_NAME_ARTHURS} has been created.`);
        } catch (err) {
            console.log('error', error.message, err.message);
        }
    }
}

async function initPostTable() {
    try {
        await dynamoDB.send(new DescribeTableCommand({ TableName: TABLE_NAME_POSTS }));
        console.log(`${TABLE_NAME_POSTS} already exists.`);
        await dynamoDB.send(new DeleteTableCommand({ TableName: TABLE_NAME_POSTS }));
        console.log(`${TABLE_NAME_POSTS} has been deleted.`);
        await createTable(TABLE_NAME_POSTS);
        console.log(`${TABLE_NAME_POSTS} has been created.`);
    } catch (error) {
        try {
            await createTable(TABLE_NAME_POSTS);
            console.log(`${TABLE_NAME_POSTS} has been created.`);
        } catch (err) {
            console.log('error', error.message, err.message);   
        }
    }
}

/*
DynamoDB is schemaless: When you create a table in DynamoDB, you specify only the primary key attributes,
such as partition key or partition key and sort key.
*/

async function createTable(table) {
    try {
        const command = new CreateTableCommand(tableInputs(table));
        return await dynamoDB.send(command);
    } catch (error) {
        console.log('error', error.message);
    }
}


function tableInputs(table) {
    const input = {
        "AttributeDefinitions": [
            {
                "AttributeName": "id",
                "AttributeType": "S"
            }
        ],
        "KeySchema": [
            {
                "AttributeName": "id",
                "KeyType": "HASH"
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableName": table
    };
    return input;
}


init();