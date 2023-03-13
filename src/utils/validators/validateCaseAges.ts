import { CourtDateRange } from "types/CaseListQueryParams"
import { CaseAgeOptions } from "utils/caseAgeOptions"

export const validateCaseAgeKeys = (caseAge: string | undefined): boolean =>
  Object.keys(CaseAgeOptions).includes(String(caseAge))

export const mapCaseAges = (caseAge: string | string[] | undefined): CourtDateRange | CourtDateRange[] | undefined => {
  const validatedCaseAgeNames = [caseAge].flat().filter(validateCaseAgeKeys) as []
  const caseAges = validatedCaseAgeNames.map((name) => name && CaseAgeOptions[name]())
  return caseAges.length > 1 ? caseAges : caseAges[0]
}
