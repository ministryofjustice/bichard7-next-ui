import { subDays, subWeeks } from "date-fns"
import { CourtDateRange, NamedCourtDateRanges } from "types/CaseListQueryParams"
import KeyValuePair from "types/KeyValuePair"

const NamedDateRangeOptions: KeyValuePair<string, () => CourtDateRange> = {
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
  }
}

export const validateNamedDateRange = (dateRange: string | undefined): boolean =>
  Object.keys(NamedDateRangeOptions).includes(String(dateRange))

export const mapDateRange = (dateRange: string | string[] | undefined): CourtDateRange | undefined => {
  const validatedDateRangeNames = [dateRange].flat().filter(validateNamedDateRange) as NamedCourtDateRanges[]
  return validatedDateRangeNames.map((range) => range && NamedDateRangeOptions[range]())[0]
}
