import deleteQueryParamsByName from "./deleteQueryParamsByName"

describe("deleteQueryParams", () => {
  it("can delete a named parameter from search queries", () => {
    const query = { defendant: "Name", type: ["exceptions", "triggers"] }

    expect(deleteQueryParamsByName(["defendant"], query)).toStrictEqual({ type: ["exceptions", "triggers"] })
  })

  it("should not modify query when deleting a parameter that does not exist", () => {
    const query = { defendant: "Name", type: ["exceptions", "triggers"] }
    expect(deleteQueryParamsByName(["invalid key"], query)).toStrictEqual(query)
  })

  it("should delete a named parameter with multiple values", () => {
    const query = { defendant: "Name", type: ["exceptions", "triggers"] }
    expect(deleteQueryParamsByName(["type"], query)).toStrictEqual({ defendant: "Name" })
  })

  it("should delete multiple named parameters", () => {
    const query = { defendant: "Name", type: ["exceptions", "triggers"] }
    expect(deleteQueryParamsByName(["type", "defendant"], query)).toStrictEqual({})
  })
})
