export type QueryOrder = "ASC" | "DESC" | undefined

export type CaseListQueryParams = {
  orderBy?: string
  order?: QueryOrder
  limit: number
  defendantName?: string
  forces: string[]
}
