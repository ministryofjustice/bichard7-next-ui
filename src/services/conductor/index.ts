import { Task, Workflow } from "@io-orkes/conductor-javascript"
import axios from "axios"

const { CONDUCTOR_API_URL, CONDUCTOR_API_USER, CONDUCTOR_API_PASSWORD } = process.env
const base64 = (input: string): string => Buffer.from(input).toString("base64")

function basicAuthenticationHeaders(): { Authorization: string } {
  return { Authorization: `Basic ${base64(`${CONDUCTOR_API_USER}:${CONDUCTOR_API_PASSWORD}`)}` }
}

export const fetchWorkflowByCorrelationId = (correlationId: string): Promise<Workflow> =>
  axios.get(`${CONDUCTOR_API_URL}/api/workflow/bichard_process/correlated/${correlationId}`, {
    headers: basicAuthenticationHeaders()
  })

export const completeWaitingTask = (workflow: Workflow) => axios.post()
