export type QueryOrder = "ASC" | "DESC" | undefined

export type QueryParams = {
  orderBy?: string
  order?: QueryOrder
  pageNum: string
  maxPageItems: string
  forces: string[]
}
