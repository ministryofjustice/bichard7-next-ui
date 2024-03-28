import { CourtDateRange } from "types/CaseListQueryParams"
import { CaseAgeOptions } from "utils/caseAgeOptions"

export const validateCaseAgeKeys = (caseAge: string): boolean => Object.keys(CaseAgeOptions).includes(caseAge)

export const mapCaseAges = (caseAge: string | string[] | undefined): CourtDateRange[] => {
  if (!caseAge) {
    return []
  }

  return [caseAge]
    .flat()
    .filter(validateCaseAgeKeys)
    .map((name) => CaseAgeOptions[name]())
}
