import { subDays } from "date-fns"
import MockDate from "mockdate"
import { mapCaseAges, validateCaseAgeKeys } from "./validateCaseAges"

describe("mapCaseAges", () => {
  afterEach(() => {
    MockDate.reset()
  })

  it("Should return a date range for 'Today'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    MockDate.set(dateToday)

    const result = mapCaseAges("Today")
    expect(result).toEqual({ from: dateToday, to: dateToday })
  })

  it("Should return a date range for 'Yesterday'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateYesterday = subDays(dateToday, 1)
    MockDate.set(dateToday)

    const result = mapCaseAges("Yesterday")
    expect(result).toEqual({ from: dateYesterday, to: dateYesterday })
  })

  it("Should return a date range for 'Day 2'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay2 = subDays(dateToday, 2)

    MockDate.set(dateToday)

    const result = mapCaseAges("Day 2")
    expect(result).toEqual({ from: dateDay2, to: dateDay2 })
  })

  it("Should return a date range for 'Day 3'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay3 = subDays(dateToday, 3)

    MockDate.set(dateToday)

    const result = mapCaseAges("Day 3")
    expect(result).toEqual({ from: dateDay3, to: dateDay3 })
  })

  it("Should return undefined for an invalid key", () => {
    expect(mapCaseAges("Invalid date range key")).toBeUndefined()
  })

  it("Should return a date range for multiple keys", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay2 = subDays(dateToday, 2)

    MockDate.set(dateToday)

    const result = mapCaseAges(["Today", "Day 2", "Should ignore invalid key"])
    expect(result).toEqual([
      { from: dateToday, to: dateToday },
      { from: dateDay2, to: dateDay2 }
    ])
  })

  it("Should return undefined for an invalid key", () => {
    expect(mapCaseAges(["invalid key"])).toBeUndefined()
    expect(mapCaseAges("invalid key")).toBeUndefined()
  })
})

describe("validateCaseAgeKeys", () => {
  it.each([
    { input: "Today", expected: true },
    { input: "Yesterday", expected: true },
    { input: "Day 2", expected: true },
    { input: "Day 3", expected: true },
    { input: "Invalid Date Range", expected: false }
  ])("check whether '$input' is a valid date range", ({ input, expected }) => {
    expect(validateCaseAgeKeys(input)).toBe(expected)
  })
})
