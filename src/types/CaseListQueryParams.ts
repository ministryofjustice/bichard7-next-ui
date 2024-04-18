export type QueryOrder = "asc" | "desc"

export enum Reason {
  All = "All",
  Exceptions = "Exceptions",
  Triggers = "Triggers"
}

export enum LockedState {
  All = "All",
  Locked = "Locked",
  Unlocked = "Unlocked",
  LockedToMe = "LockedToMe"
}

export type CourtDateRange = {
  from: Date
  to: Date
}

export type SerializedCourtDateRange = {
  from?: string
  to?: string
}

export type CaseState = "Resolved" | "Unresolved" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  reason?: Reason
  defendantName?: string
  courtName?: string
  ptiurn?: string
  pageNum?: string
  maxPageItems: string
  courtDateRange?: CourtDateRange | CourtDateRange[]
  lockedState?: string
  caseState?: CaseState
  allocatedToUserName?: string
  reasonCodes?: string[]
  resolvedByUsername?: string
}
