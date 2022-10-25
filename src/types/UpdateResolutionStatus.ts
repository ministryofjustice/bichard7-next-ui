import { ResolutionStatus } from "./ResolutionStatus"

type UpdateResolutionStatus = {
  errorStatus?: ResolutionStatus
  errorResolvedBy?: string
  errorResolvedTimestamp?: Date
  triggerStatus?: ResolutionStatus
  triggerResolvedBy?: string
  triggerResolvedTimestamp?: Date
  resolutionTimestamp?: Date
}

export default UpdateResolutionStatus
