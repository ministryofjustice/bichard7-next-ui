import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "../entities/CourtCase"
import { fetchBichardProcessByCorrelationId } from "./fetchBichardProcessByCorrelationId"
import { TaskStatus } from "./types"
import { updateWaitingTask } from "./updateWaitingTask"

export const continueConductorWorkflow = async (
  courtCase: CourtCase,
  continueData: Record<string, unknown>
): PromiseResult<void> => {
  const fetchWorkflowResult = await fetchBichardProcessByCorrelationId(courtCase.messageId)
  if (isError(fetchWorkflowResult)) {
    return fetchWorkflowResult
  }

  if (!fetchWorkflowResult.workflowId) {
    return new Error("Workflow ID missing from workflow object")
  }

  const completeWaitingTaskResult = await updateWaitingTask({
    workflowId: fetchWorkflowResult.workflowId,
    taskRefName: "wait_for_resubmission",
    taskStatus: TaskStatus.COMPLETED,
    taskCompletionData: continueData
  })
  if (isError(completeWaitingTaskResult)) {
    return completeWaitingTaskResult
  }
}
