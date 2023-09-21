export type UpdateWaitingTask = {
  workflowId: string
  taskRefName: string
  taskStatus: string
  taskCompletionData?: Record<string, unknown>
}

export type FailWaitingTask = UpdateWaitingTask & {
  taskFailureReason: string
}

export enum TaskStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  FAILED = "FAILED"
}
