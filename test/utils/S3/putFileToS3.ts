import { PutObjectCommand, S3Client, type PutObjectCommandOutput, type S3ClientConfig } from "@aws-sdk/client-s3"
import { isError } from "types/Result"

const putFileToS3 = async (
  body: string,
  fileName: string,
  bucket: string,
  config: S3ClientConfig
): Promise<void | Error> => {
  const client = new S3Client(config)
  const command = new PutObjectCommand({ Bucket: bucket, Key: fileName, Body: body })
  let lastResponse: Error | PutObjectCommandOutput | undefined = undefined

  for (let retries = 0; retries < 5; retries++) {
    lastResponse = await client.send(command).catch((err: Error) => err)

    if (lastResponse && !isError(lastResponse)) {
      return
    }
    console.error(lastResponse)
  }
  return lastResponse ? lastResponse : new Error("Error putting file to S3")
}

export default putFileToS3