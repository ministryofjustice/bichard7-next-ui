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
  freeText?: string
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

  // TODO:
  // Search for all incoming_message_handler  workflows: http://localhost:5002/api/workflow/search?query=%22workflowType=incoming_message_handler%20AND%20status=COMPLETED%22
  // Filter the JSON in the test and pull out the one with our externalId
  // Grab the output from that: "output": "{s3TaskDataPath=6a91ec91-c9ca-42a7-a489-d32ecb3e1ed1.json}",
  // Search for bichard_process workflow using the id in the output: http://localhost:5002/api/workflow/search?freeText=%226a91ec91-c9ca-42a7-a489-d32ec[…]ery=%22workflowType=bichard_process%20AND%20status=RUNNING%22

  // search for the workflow
  const workflows = await waitForWorkflows({
    query: {
      workflowType: "incoming_message_handler",
      status: "COMPLETED"
    }
  })
  expect(workflows).toHaveLength(1)

  // const incomingMessageHandlerWorkflow = workflows[1]
}
