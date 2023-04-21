import { Client } from "pg"

export const pgListCourtCases = async (
  client: Client
  // filterOptions?: { defendantName?: string; courtName?: string }
) => {
  const queryString = "select * from br7own.error_list"
  client.query(queryString, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
      return res
    }
  })
}
// console.log(courtCases)
