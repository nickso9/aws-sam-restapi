## Setup

1. Start Dynamodb Docker
    - download amazon/dynamodb-local
    - docker run -d -p 8000:8000 amazon/dynamodb-local 
    - docker ps (check if docker image was created)
    - aws dynamodb list-tables --endpoint-url http://localhost:8000  (check tables)

2. Seed database
    - Run database/createTables
    - Run database/seeds

## Start Api
sam local start-api --env-vars env.json

## Run a single function 
sam local invoke "HelloWorldFunction"
