import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const DYNAMODB_URI = "http://localhost:8000";
const TABLE_NAME_POSTS = "posts";
const TABLE_NAME_ARTHURS = "arthurs";
const dynamoDB = new DynamoDBClient({ endpoint: DYNAMODB_URI });

const arthurIds = [uuidv4(), uuidv4(), uuidv4()];

async function init() {
    try {
        const command = new BatchWriteItemCommand(tableInputs());
        await dynamoDB.send(command);
    } catch (error) {
        console.log('error: ', error.message);
    }
}

// function arthurInputs() {

// }

function tableInputs() {
    const input = {
        "RequestItems": {
            [TABLE_NAME_POSTS]: [
                {
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": uuidv4()
                            },
                            "arthur": {
                                "S": arthurIds[Math.floor(Math.random() * arthurIds.length)]
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
                                "S": arthurIds[Math.floor(Math.random() * arthurIds.length)]
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
                                "S": arthurIds[Math.floor(Math.random() * arthurIds.length)]
                            },
                            "title": {
                                "S": "Whos line is it anyway?"
                            },
                            "message": {
                                "S": "Okay this is another message"
                            }
                        }
                    }
                },{
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": uuidv4()
                            },
                            "arthur": {
                                "S": arthurIds[Math.floor(Math.random() * arthurIds.length)]
                            },
                            "title": {
                                "S": "hello world"
                            },
                            "message": {
                                "S": "goooooodbye"
                            }
                        }
                    }
                }
            ],
            [TABLE_NAME_ARTHURS]: [
                {
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": arthurIds[0]
                            },
                            "name": {
                                "S": "roger lodge"
                            }
                        }
                    }
                },
                {
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": arthurIds[1]
                            },
                            "name": {
                                "S": "bob barker"
                            }
                        }
                    }
                },
                {
                    "PutRequest": {
                        "Item": {
                            "id": {
                                "S": arthurIds[2]
                            },
                            "name": {
                                "S": "drew carey"
                            }
                        }
                    }
                }
            ]
        },
        
    };
    return input;
}

init();

