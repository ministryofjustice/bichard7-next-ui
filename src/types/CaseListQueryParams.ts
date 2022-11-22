export type QueryOrder = "asc" | "desc" | undefined

export type Filter = "Triggers" | "Exceptions"

export type NamedCourtDateRanges = "Today" | undefined

export type CourtDateRange = {
  from: Date
  to: Date
}

export type Urgency = "Urgent" | "Non-urgent" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  resultFilter?: Filter[]
  defendantName?: string
  urgentFilter?: Urgency
  forces: string[]
  pageNum?: string
  maxPageItems: string
  courtDateRange?: CourtDateRange
}
