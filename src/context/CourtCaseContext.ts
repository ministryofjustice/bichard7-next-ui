import { createContext, useCallback, useContext, useState } from "react"
import { Amender, AmendmentKeys, AmendmentRecords, IndividualAmendmentValues } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import setAmendedFields from "../utils/amendments/setAmendedField"

interface CourtCaseContextType {
  courtCase: DisplayFullCourtCase
}

interface CourtCaseContextResult extends CourtCaseContextType {
  amend: Amender
  amendments: AmendmentRecords
}

const CourtCaseContext = createContext<CourtCaseContextType | null>(null)

const useCourtCase = (): CourtCaseContextResult => {
  const [amendments, setAmendments] = useState<AmendmentRecords>({})
  const courtCaseContext = useContext(CourtCaseContext) as CourtCaseContextResult

  if (!courtCaseContext) {
    throw new Error("courtCase has to be used within <CourtCaseContext.Provider>")
  }

  courtCaseContext.amend = useCallback(
    (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => {
      setAmendments((previousAmendments) => ({ ...setAmendedFields(keyToAmend, newValue, previousAmendments) }))
    },
    []
  )

  courtCaseContext.amendments = amendments

  return courtCaseContext
}

export { CourtCaseContext, useCourtCase }
export type { CourtCaseContextType }
