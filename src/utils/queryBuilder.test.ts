import { queryBuilder } from "./queryBuilder"

describe("queryBuilder tests", () => {
  it.only("should take an input object strings of filter options", () => {
    const filterOptions = { defendantName: "Wayne Bruce" }
    const result = queryBuilder(filterOptions)
    expect(typeof result).toBe("string")
  })

  it.only("should take 1 input string, and return a valid query", () => {
    const filterOptions = { defendantName: "Wayne Bruce" }
    const result = queryBuilder(filterOptions)
    expect(result).toBe("select * from br7own.error_list defendant_name ilike '%Wayne Bruce%'")


  })
})
