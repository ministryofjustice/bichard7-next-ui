import { subDays } from "date-fns"
import { CourtDateRange } from "types/CaseListQueryParams"
import KeyValuePair from "types/KeyValuePair"

export const CaseAgeOptions: KeyValuePair<string, () => CourtDateRange> = {
  Today: () => {
    return { from: new Date(), to: new Date() }
  },
  Yesterday: () => {
    return { from: subDays(new Date(), 1), to: subDays(new Date(), 1) }
  },
  "Day 2": () => {
    return { from: subDays(new Date(), 2), to: subDays(new Date(), 2) }
  },
  "Day 3": () => {
    return { from: subDays(new Date(), 3), to: subDays(new Date(), 3) }
  },
  "Day 4": () => {
    return { from: subDays(new Date(), 4), to: subDays(new Date(), 4) }
  },
  "Day 5": () => {
    return { from: subDays(new Date(), 5), to: subDays(new Date(), 5) }
  }
}
