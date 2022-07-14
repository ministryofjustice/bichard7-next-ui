type QueryParams = {
  orderBy?: string
  order?: "ASC" | "DESC" | undefined
  limit: number
  forces: string[]
}

export default QueryParams
