import { subDays, subWeeks } from "date-fns"
import MockDate from "mockdate"
import { mapDateRange, validateNamedDateRange } from "./validateDateRanges"

describe("mapDateRange", () => {
  afterEach(() => {
    MockDate.reset()
  })

  it("should return a date range for 'Today'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    MockDate.set(dateToday)

    const result = mapDateRange("Today")
    expect(result).toEqual({ from: dateToday, to: dateToday })
  })

  it("should return a date range for 'Yesterday'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateYesterday = subDays(dateToday, 1)
    MockDate.set(dateToday)

    const result = mapDateRange("Yesterday")
    expect(result).toEqual({ from: dateYesterday, to: dateYesterday })
  })

  it("should return a date range for 'This week'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateLastWeek = subWeeks(dateToday, 1)

    MockDate.set(dateToday)

    const result = mapDateRange("This week")
    expect(result).toEqual({ from: dateLastWeek, to: dateToday })
  })

  it("should return undefined for an invalid key", () => {
    expect(mapDateRange("Invalid date range key")).toBeUndefined()
  })
})

describe("validateDateRange", () => {
  it.each([
    { input: "Today", expected: true },
    { input: "Yesterday", expected: true },
    { input: "This week", expected: true },
    { input: "Invalid Date Range", expected: false }
  ])("check whether '$input' is a valid date range", ({ input, expected }) => {
    expect(validateNamedDateRange(input)).toBe(expected)
  })
})
