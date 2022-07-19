export type QueryOrder = "ASC" | "DESC" | undefined

export type Filter = "TRIGGERS" | "EXCEPTIONS" | undefined

export type QueryParams = {
  orderBy?: string
  order?: QueryOrder
  filter?: Filter
  limit: number
  forces: string[]
}
