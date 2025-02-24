
# Start all APIs defined in template.yaml

sam local start-api


# check aws logged in 

aws sts get-caller-identity

# test api in cmd line

https://5l1hwvajm2.execute-api.us-east-2.amazonaws.com/Prod/hello/

# directly call function 

sam local invoke "HelloWorldFunction"

# delete stack (whole project)

aws cloudformation delete-stack --stack-name sam-app --region us-east-2

sam delete <- will delete current stack

# DynamoDB Local

docker ps <--check if running

docker run -d -p 8000:8000 amazon/dynamodb-local <--- restart

aws dynamodb list-tables --endpoint-url http://localhost:8000 <--- list tables

