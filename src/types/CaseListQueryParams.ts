export type QueryOrder = "asc" | "desc" | null

export type Reason = "Triggers" | "Exceptions"

export type NamedCourtDateRanges = "Today" | undefined

export type CourtDateRange = {
  from: Date
  to: Date
}

export type CaseState = "Resolved" | "Unresolved and resolved" | undefined

export type Urgency = "Urgent" | "Non-urgent" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  reasonsFilter?: Reason[]
  defendantName?: string
  courtName?: string
  ptiurn?: string
  urgent?: Urgency
  forces: string[]
  pageNum?: string
  maxPageItems: string
  courtDateRange?: CourtDateRange
  locked?: boolean
  caseState?: CaseState
  allocatedToUserName?: string
  reasonsSearch?: string
}
