export type QueryOrder = "asc" | "desc" | undefined

export type Filter = "triggers" | "exceptions" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  filter?: Filter
  limit: number
  defendantName?: string
  forces: string[]
}
