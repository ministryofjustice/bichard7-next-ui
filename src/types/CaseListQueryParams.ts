export type QueryOrder = "ASC" | "DESC" | undefined

export type Filter = "TRIGGERS" | "EXCEPTIONS" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  filter?: Filter
  limit: number
  defendantName?: string
  forces: string[]
}
