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
                            "id": {
                                "S": uuidv4()
                            },
                            "arthur": {
                                "S": "bob barker"
                            },
                            "title": {
                                "S": "Hello all"
                            },
                            "message": {
                                "S": "this is a message"
                            }
                        }
                    }
                },
                {
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": uuidv4()
                            },
                            "arthur": {
                                "S": "bob barker"
                            },
                            "title": {
                                "S": "What is going on ?"
                            },
                            "message": {
                                "S": "I am sitting here and standing there"
                            }
                        }
                    }
                },
                {
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": uuidv4()
                            },
                            "arthur": {
                                "S": "drew carey"
                            },
                            "title": {
                                "S": "Whos line is it anyway?"
                            },
                            "message": {
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

