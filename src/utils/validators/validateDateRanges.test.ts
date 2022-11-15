import MockDate from "mockdate"
import { validateDateRanges } from "./validateDateRanges"

describe("validateDateRanges", () => {
  afterEach(() => {
    MockDate.reset()
  })

  it("should return a date range for a valid key", () => {
    const dateToday = new Date("2022-11-15T12:30")
    MockDate.set(dateToday)

    const result = validateDateRanges("Today")
    expect(result).toEqual({ from: dateToday, to: dateToday })
  })

  it("should return undefined for an invalid key", () => {
    expect(validateDateRanges("Invalid date range key")).toBeUndefined()
  })
})
