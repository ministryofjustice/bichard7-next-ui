export type QueryOrder = "asc" | "desc" | undefined

export type Filter = "triggers" | "exceptions" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  resultFilter?: Filter
  defendantName?: string
  isUrgent?: boolean
  forces: string[]
  pageNum?: string
  maxPageItems: string
}
