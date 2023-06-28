import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

const deleteFromDynamoTable = async (tableName: string, keyName: string) => {
  const config = {
    endpoint: "http://localhost:8000",
    region: "eu-west-2"
  }

  const dynamoDb = new DynamoDB(config)
  const client = new DocumentClient({
    service: dynamoDb
  })

  const items = await client
    .scan({
      TableName: tableName
    })
    .promise()

  const promises =
    items.Items?.map((item) =>
      client
        .delete({
          TableName: tableName,
          Key: {
            [keyName]: item[keyName]
          }
        })
        .promise()
    ) ?? []

  await Promise.all(promises)
}

export default deleteFromDynamoTable
