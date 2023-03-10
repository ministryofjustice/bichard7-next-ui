import { CourtDateRange, NamedCourtDateRange } from "types/CaseListQueryParams"
import { NamedDateRangeOptions } from "utils/namedDateRange"

export const validateCaseAgeKeys = (dateRange: string | undefined): boolean =>
  Object.keys(NamedDateRangeOptions).includes(String(dateRange))

export const mapDateRanges = (
  dateRange: string | string[] | undefined
): CourtDateRange | CourtDateRange[] | undefined => {
  const validatedDateRangeNames = [dateRange].flat().filter(validateCaseAgeKeys) as NamedCourtDateRange[]
  const dateRanges = validatedDateRangeNames.map((range) => range && NamedDateRangeOptions[range]())
  return dateRanges.length > 1 ? dateRanges : dateRanges[0]
}
