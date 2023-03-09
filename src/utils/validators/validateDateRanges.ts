import { CourtDateRange, NamedCourtDateRange } from "types/CaseListQueryParams"
import { NamedDateRangeOptions } from "utils/namedDateRange"

export const validateSlaDateRange = (dateRange: string | undefined): boolean =>
  Object.keys(NamedDateRangeOptions).includes(String(dateRange))

export const mapDateRange = (dateRange: string | string[] | undefined): CourtDateRange | undefined => {
  const validatedDateRangeNames = [dateRange].flat().filter(validateSlaDateRange) as NamedCourtDateRange[]
  return validatedDateRangeNames.map((range) => range && NamedDateRangeOptions[range]())[0]
}
