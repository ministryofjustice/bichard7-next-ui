import { CourtDateRange, NamedCourtDateRange } from "types/CaseListQueryParams"
import { NamedDateRangeOptions } from "utils/namedDateRange"

export const validateCaseAgeKeys = (caseAge: string | undefined): boolean =>
  Object.keys(NamedDateRangeOptions).includes(String(caseAge))

export const mapDateRanges = (
  caseAge: string | string[] | undefined
): CourtDateRange | CourtDateRange[] | undefined => {
  const validatedDateRangeNames = [caseAge].flat().filter(validateCaseAgeKeys) as NamedCourtDateRange[]
  const caseAges = validatedDateRangeNames.map((range) => range && NamedDateRangeOptions[range]())
  return caseAges.length > 1 ? caseAges : caseAges[0]
}
