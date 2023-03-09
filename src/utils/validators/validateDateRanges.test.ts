import { subDays } from "date-fns"
import MockDate from "mockdate"
import { mapDateRange, validateSlaDateRange } from "./validateDateRanges"

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

  it("should return a date range for 'Day 2'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay2 = subDays(dateToday, 2)

    MockDate.set(dateToday)

    const result = mapDateRange("Day 2")
    expect(result).toEqual({ from: dateDay2, to: dateDay2 })
  })

  it("should return a date range for 'Day 3'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay3 = subDays(dateToday, 3)

    MockDate.set(dateToday)

    const result = mapDateRange("Day 3")
    expect(result).toEqual({ from: dateDay3, to: dateDay3 })
  })

  it("should return undefined for an invalid key", () => {
    expect(mapDateRange("Invalid date range key")).toBeUndefined()
  })
})

describe("validateDateRange", () => {
  it.each([
    { input: "Today", expected: true },
    { input: "Yesterday", expected: true },
    { input: "Day 2", expected: true },
    { input: "Day 3", expected: true },
    { input: "Invalid Date Range", expected: false }
  ])("check whether '$input' is a valid date range", ({ input, expected }) => {
    expect(validateSlaDateRange(input)).toBe(expected)
  })
})
