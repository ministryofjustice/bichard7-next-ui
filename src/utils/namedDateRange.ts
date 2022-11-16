import { subDays, subMonths, subWeeks } from "date-fns"
import { CourtDateRange } from "types/CaseListQueryParams"
import KeyValuePair from "types/KeyValuePair"

export const NamedDateRangeOptions: KeyValuePair<string, () => CourtDateRange> = {
  Today: () => {
    return { from: new Date(), to: new Date() }
  },
  Yesterday: () => {
    return { from: subDays(new Date(), 1), to: subDays(new Date(), 1) }
  },
  "This week": () => {
    return { from: subWeeks(new Date(), 1), to: new Date() }
  },
  "Last week": () => {
    return { from: subWeeks(new Date(), 2), to: subWeeks(new Date(), 1) }
  },
  "This month": () => {
    return { from: subMonths(new Date(), 1), to: new Date() }
  }
}
