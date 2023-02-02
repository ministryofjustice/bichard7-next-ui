import { validateCustomDateRange } from "./validateCustomDateRange"

describe("validateCustomDateRange", () => {
  it("should return a date range for a valid from and to dates", () => {
    const expectedToDate = new Date("2022-01-01")
    const expectedFromDate = new Date("2022-12-31")

    const result = validateCustomDateRange({
      from: "2022-01-01",
      to: "2022-12-31"
    })
    expect(result).toEqual({ from: expectedToDate, to: expectedFromDate })
  })

  it("should return undefined if one of the date parameters is undefined", () => {
    const result = validateCustomDateRange({
      from: undefined,
      to: "2022-12-31"
    })
    expect(result).toBeUndefined()
  })

  it("should return undefined if one of the date parameters is an invalid input", () => {
    const result = validateCustomDateRange({
      from: "invalid-input!",
      to: "2022-12-31"
    })
    expect(result).toBeUndefined()
  })
})
