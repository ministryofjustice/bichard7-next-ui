import deleteQueryParamsByName from "./deleteQueryParamsByName"

describe("deleteQueryParams", () => {
  beforeEach(() => {
    const query = new URLSearchParams()
    query.append("defendant", "Name")
    query.append("type", "exeptions")
    query.append("type", "triggers")
  })
  it("can delete a named parameter from search queries", () => {
    expect(deleteQueryParamsByName(["defendant"], query)).toStrictEqual({ type: ["exceptions", "triggers"] })
  })

  it("should not modify query when deleting a parameter that does not exist", () => {
    expect(deleteQueryParamsByName(["invalid key"], query)).toStrictEqual(query)
  })

  it("should delete a named parameter with multiple values", () => {
    expect(deleteQueryParamsByName(["type"], query)).toStrictEqual({ defendant: "Name" })
  })

  it("should delete multiple named parameters", () => {
    expect(deleteQueryParamsByName(["type", "defendant"], query)).toStrictEqual({})
  })
})
