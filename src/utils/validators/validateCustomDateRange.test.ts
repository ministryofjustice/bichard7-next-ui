import { validateCustomDateRange } from "./validateCustomDateRange"

describe("mapDateRange", () => {
  it("should return a date range for a valid from and to dates", () => {
    const expectedToDate = new Date("2022-01-01")
    const expectedFromDate = new Date("2022-12-31")

    const result = validateCustomDateRange({
      fromDay: "1",
      fromMonth: "1",
      fromYear: "2022",
      toDay: "31",
      toMonth: "12",
      toYear: "2022"
    })
    expect(result).toEqual({ from: expectedToDate, to: expectedFromDate })
  })

  it("should return undefined if one of the date parameters is undefined", () => {
    const result = validateCustomDateRange({
      fromDay: "1",
      fromMonth: undefined,
      fromYear: "2022",
      toDay: "31",
      toMonth: "12",
      toYear: "2022"
    })
    expect(result).toBeUndefined()
  })
})
