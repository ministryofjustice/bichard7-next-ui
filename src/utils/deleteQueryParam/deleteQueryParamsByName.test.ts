import deleteQueryParamsByName from "./deleteQueryParamsByName"

describe("deleteQueryParams", () => {
  let query: URLSearchParams
  let expectedQuery: URLSearchParams
  beforeEach(() => {
    query = new URLSearchParams()
    query.append("defendant", "Name")
    query.append("type", "exeptions")
    query.append("type", "triggers")

    expectedQuery = new URLSearchParams()
  })
  it("can delete a named parameter from search queries", () => {
    expectedQuery.append("type", "exeptions")
    expectedQuery.append("type", "triggers")
    expect(deleteQueryParamsByName(["defendant"], query)).toStrictEqual(expectedQuery)
  })

  it("should not modify query when deleting a parameter that does not exist", () => {
    expect(deleteQueryParamsByName(["invalid key"], query)).toStrictEqual(query)
  })

  it("should delete a named parameter with multiple values", () => {
    expectedQuery.append("defendant", "Name")
    expect(deleteQueryParamsByName(["type"], query)).toStrictEqual(expectedQuery)
  })

  it("should delete multiple named parameters", () => {
    expect(deleteQueryParamsByName(["type", "defendant"], query)).toStrictEqual(expectedQuery)
  })
})
