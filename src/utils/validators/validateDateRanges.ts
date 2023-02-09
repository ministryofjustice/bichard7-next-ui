import { CourtDateRange, NamedCourtDateRanges } from "types/CaseListQueryParams"
import { NamedDateRangeOptions } from "utils/namedDateRange"

export const validateNamedDateRange = (dateRange: string | undefined): boolean =>
  Object.keys(NamedDateRangeOptions).includes(String(dateRange))

export const mapDateRange = (dateRange: string | string[] | undefined): CourtDateRange | undefined => {
  const validatedDateRangeNames = [dateRange].flat().filter(validateNamedDateRange) as NamedCourtDateRanges[]
  return validatedDateRangeNames.map((range) => range && NamedDateRangeOptions[range]())[0]
}
