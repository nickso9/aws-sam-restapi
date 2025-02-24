// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import {
//   PutItemCommand,
//   GetItemCommand,
//   UpdateItemCommand,
//   DeleteItemCommand,
//   ScanCommand,
// } from "@aws-sdk/client-dynamodb";
// import { v4 as uuidv4 } from 'uuid'

// const dynamoDB = new DynamoDBClient({
//   endpoint: process.env.DYNAMODB_URI
// });

// const TABLE_NAME = process.env.TABLE_NAME;

// export const getPostsByArthur = async (event, context) => {
//     console.log('asdasdjjj')
//   const searchName = event.pathParameters?.arthur;

// //   const params = {
// //     TableName: TABLE_NAME,
// //     ProjectionExpression: "arthur, title, message", // Select specific attributes to fetch
// //     FilterExpression: "contains(arthur, :searchName)",
// //     ExpressionAttributeValues: {
// //       ":searchName": { "S": searchName.toLowerCase() }
// //     }
// //   };

// //   try {
// //     const command = new ScanCommand(params)
// //     const data = await dynamoDB.send(command);

// //     return {
// //       statusCode: 200,
// //       body: JSON.stringify(data.Items), // Returns all items
// //     };
// //   } catch (error) {
// //     return {
// //       statusCode: 500,
// //       body: JSON.stringify({ message: error.message }),
// //     };
// //   }
// };