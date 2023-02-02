import { validateCustomDateRange } from "./validateCustomDateRange"

describe("mapDateRange", () => {
  it("should return a date range for a valid from and to dates", () => {
    const toDate = new Date("2022-01-01")
    const fromDate = new Date("2022-12-31")

    const result = validateCustomDateRange({
      fromDay: "1",
      fromMonth: "1",
      fromYear: "2022",
      toDay: "31",
      toMonth: "12",
      toYear: "2022"
    })
    expect(result).toEqual({ from: toDate, to: fromDate })
  })
})
