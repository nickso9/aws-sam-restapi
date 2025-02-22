import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const DYNAMODB_URI = "http://localhost:8000";
const TABLE_NAME = "posts"
const dynamoDB = new DynamoDBClient({ endpoint: DYNAMODB_URI });


async function init() {
    const command = new BatchWriteItemCommand(postInputs());
    await dynamoDB.send(command);
}

function postInputs() {
    const input = {
        "RequestItems": {
            [TABLE_NAME]: [
                {
                    "PutRequest": {
                        "Item": {
                            "Id": {
                                "S": uuidv4()
                            },
                            "Arthur": {
                                "S": "bob barker"
                            },
                            "Title": {
                                "S": "Hello all"
                            },
                            "Message": {
                                "S": "this is a message"
                            }
                        }
                    }
                },
                {
                    "PutRequest": {
                        "Item": {
                            "Id": {
                                "S": uuidv4()
                            },
                            "Arthur": {
                                "S": "bob barker"
                            },
                            "Title": {
                                "S": "What is going on ?"
                            },
                            "Message": {
                                "S": "I am sitting here and standing there"
                            }
                        }
                    }
                },
                {
                    "PutRequest": {
                        "Item": {
                            "Id": {
                                "S": uuidv4()
                            },
                            "Arthur": {
                                "S": "drew carey"
                            },
                            "Title": {
                                "S": "Whos line is it anyway?"
                            },
                            "Message": {
                                "S": "Okay this is another message"
                            }
                        }
                    }
                }
            ]
        }
    };
    return input;
}

init();

