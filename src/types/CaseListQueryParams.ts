export type QueryOrder = "asc" | "desc" | undefined

export type Filter = "triggers" | "exceptions"

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  resultFilter?: Filter[]
  defendantName?: string
  urgentFilter?: boolean
  forces: string[]
  pageNum?: string
  maxPageItems: string
}
