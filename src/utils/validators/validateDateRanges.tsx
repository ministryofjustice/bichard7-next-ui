import { CourtDateRange, NamedCourtDateRanges } from "types/CaseListQueryParams"
import KeyValuePair from "types/KeyValuePair"

const validCourtDateRanges = ["Today"]
const getDateRange = (dateRange: NamedCourtDateRanges): CourtDateRange | undefined => {
  const options: KeyValuePair<string, CourtDateRange> = {
    Today: { from: new Date(), to: new Date() }
  }
  return dateRange && options[dateRange]
}

export const validateDateRanges = (dateRange: string | string[] | undefined) => {
  const validatedDateRangeNames = [dateRange]
    .flat()
    .filter((range) => validCourtDateRanges.includes(String(range))) as NamedCourtDateRanges[]
  return validatedDateRangeNames.map((d) => getDateRange(d))[0]
}
