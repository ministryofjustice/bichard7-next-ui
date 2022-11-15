import { CourtDateRange, NamedCourtDateRanges } from "types/CaseListQueryParams"
import KeyValuePair from "types/KeyValuePair"

const validCourtDateRanges = ["Today"]
const NamedDateRangeOptions: KeyValuePair<string, () => CourtDateRange> = {
  Today: () => {
    return { from: new Date(), to: new Date() }
  }
}

export const validateDateRanges = (dateRange: string | string[] | undefined): CourtDateRange | undefined => {
  const validatedDateRangeNames = [dateRange]
    .flat()
    .filter((range) => validCourtDateRanges.includes(String(range))) as NamedCourtDateRanges[]
  return validatedDateRangeNames.map((range) => range && NamedDateRangeOptions[range]())[0]
}
