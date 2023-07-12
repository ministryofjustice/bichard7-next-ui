import { subDays } from "date-fns"
import { CourtDateRange } from "types/CaseListQueryParams"
import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"

export const CaseAgeOptions: KeyValuePair<string, () => CourtDateRange> = {
  Today: () => {
    const today = new Date()
    return { from: today, to: today }
  },
  Yesterday: () => {
    const yesterday = subDays(new Date(), 1)
    return { from: yesterday, to: yesterday }
  },
  "Day 2": () => {
    const day2 = subDays(new Date(), 2)
    return { from: day2, to: day2 }
  },
  "Day 3": () => {
    const day3 = subDays(new Date(), 3)
    return { from: day3, to: day3 }
  },
  "Day 4": () => {
    const day4 = subDays(new Date(), 4)
    return { from: day4, to: day4 }
  },
  "Day 5": () => {
    const day5 = subDays(new Date(), 5)
    return { from: day5, to: day5 }
  },
  "Day 6": () => {
    const day6 = subDays(new Date(), 6)
    return { from: day6, to: day6 }
  },
  "Day 7": () => {
    const day7 = subDays(new Date(), 7)
    return { from: day7, to: day7 }
  },
  "Day 8": () => {
    const day8 = subDays(new Date(), 8)
    return { from: day8, to: day8 }
  },
  "Day 9": () => {
    const day9 = subDays(new Date(), 9)
    return { from: day9, to: day9 }
  },
  "Day 10": () => {
    const day10 = subDays(new Date(), 10)
    return { from: day10, to: day10 }
  },
  "Day 11": () => {
    const day11 = subDays(new Date(), 11)
    return { from: day11, to: day11 }
  },
  "Day 12": () => {
    const day12 = subDays(new Date(), 12)
    return { from: day12, to: day12 }
  },
  "Day 13": () => {
    const day13 = subDays(new Date(), 13)
    return { from: day13, to: day13 }
  },
  "Day 14": () => {
    const day14 = subDays(new Date(), 14)
    return { from: day14, to: day14 }
  },
  "Day 15 and older": () => {
    const unixEpoch = new Date(0)
    const day15 = subDays(new Date(), 15)
    return { from: unixEpoch, to: day15 }
  }
}
