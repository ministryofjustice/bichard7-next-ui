export type QueryOrder = "ASC" | "DESC" | undefined

export type QueryParams = {
  orderBy?: string
  order?: QueryOrder
  limit: number
  defendantName?: string
  forces: string[]
}
