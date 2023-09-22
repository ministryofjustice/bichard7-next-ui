import type { S3ClientConfig } from "@aws-sdk/client-s3"

process.env.S3_ENDPOINT = "http://localhost:4566"
process.env.S3_AWS_ACCESS_KEY_ID = "test"
process.env.S3_AWS_SECRET_ACCESS_KEY = "test"

const createS3Config = () => {
  const s3Config: S3ClientConfig = {
    endpoint: process.env.S3_ENDPOINT ?? "https://s3.eu-west-2.amazonaws.com",
    region: process.env.S3_REGION ?? "eu-west-2",
    forcePathStyle: true
  }

  if (process.env.S3_AWS_ACCESS_KEY_ID && process.env.S3_AWS_SECRET_ACCESS_KEY) {
    s3Config.credentials = {
      accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY
    }
  }

  return s3Config
}

export default createS3Config
