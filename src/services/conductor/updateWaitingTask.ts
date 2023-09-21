import axios, { AxiosResponse } from "axios"
import { basicAuthenticationHeaders } from "./auth"
import { FailWaitingTask, UpdateWaitingTask } from "./types"

const { CONDUCTOR_API_URL } = process.env

export const updateWaitingTask = async (
  update: UpdateWaitingTask | FailWaitingTask
): Promise<AxiosResponse | Error> => {
  const { workflowId, taskRefName, taskStatus } = update
  if (!workflowId) {
    throw new Error("Workflow ID is required")
  }

  let { taskCompletionData } = update
  if ("taskFailureReason" in update) {
    taskCompletionData ??= {}
    taskCompletionData.reasonForIncompletion = update.taskFailureReason
  }

  return axios
    .post(`${CONDUCTOR_API_URL}/api/queue/update/${workflowId}/${taskRefName}/${taskStatus}`, taskCompletionData, {
      headers: {
        ...basicAuthenticationHeaders(),
        "Content-Type": "application/json"
      }
    })
    .catch((e) => e)
}
