import axios from "axios"
import { CONDUCTOR_API_PASSWORD, CONDUCTOR_API_URL, CONDUCTOR_API_USER } from "config"
import { randomUUID } from "crypto"
import fs from "fs"
import promisePoller from "promise-poller"
import createS3Config from "./S3/createS3Config"
import putFileToS3 from "./S3/putFileToS3"

const PHASE1_BUCKET_NAME = "phase1"
const s3Config = createS3Config()

type WorkflowSearchParams = {
  freeText: string
  query: {
    workflowType?: string
    status?: string
  }
}

const headers = {
  auth: {
    username: CONDUCTOR_API_USER,
    password: CONDUCTOR_API_PASSWORD
  }
}

const searchWorkflows = async (params: WorkflowSearchParams) => {
  const { freeText } = params
  const query = Object.entries(params.query)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND ")

  const response = await axios.get(
    `${CONDUCTOR_API_URL}/api/workflow/search?freeText="${freeText}"&query="${query}"`,
    headers
  )

  if (response.data.totalHits === 0) {
    throw new Error("No workflows fetched")
  }
  return response.data.results
}
const waitForWorkflows = (query: WorkflowSearchParams) =>
  promisePoller({
    taskFn: () => searchWorkflows(query),
    retries: 900,
    interval: 100 // milliseconds
  }).catch(() => {
    throw new Error("Could not find workflow")
  })

export const startIncomingMessageWorkflow = async () => {
  const externalId = randomUUID()
  const s3Path = `2023/08/31/14/48/${externalId}.xml`

  const externalCorrelationId = randomUUID()
  const inputMessage = String(fs.readFileSync("test/test-data/InputMessage_Valid.xml"))
    .replace("EXTERNAL_CORRELATION_ID", externalCorrelationId)
    .replace("UNIQUE_HASH", randomUUID())

  await putFileToS3(inputMessage, s3Path, PHASE1_BUCKET_NAME!, s3Config)

  // search for the workflow
  const workflows = await waitForWorkflows({
    freeText: externalId,
    query: {
      workflowType: "bichard_process",
      status: "RUNNING"
    }
  })
  expect(workflows).toHaveLength(1)
}
