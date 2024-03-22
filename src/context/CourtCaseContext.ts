import { createContext, useCallback, useContext, useState } from "react"
import { Amender, Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import getAmendmentsByComparison from "utils/getAmendmentsByComparison"

interface CourtCaseContextType {
  courtCase: DisplayFullCourtCase
}

interface CourtCaseContextResult extends CourtCaseContextType {
  amend: Amender
  amendments: Amendments
}

const CourtCaseContext = createContext<CourtCaseContextType | null>(null)

const useCourtCase = (): CourtCaseContextResult => {
  const courtCaseContext = useContext(CourtCaseContext) as CourtCaseContextResult
  const { aho, updatedHearingOutcome } = courtCaseContext.courtCase
  const [amendments, setAmendments] = useState<Amendments>(getAmendmentsByComparison(aho, updatedHearingOutcome))

  if (!courtCaseContext) {
    throw new Error("courtCase has to be used within <CourtCaseContext.Provider>")
  }

  courtCaseContext.amend = useCallback(
    (key) => (newValue) => {
      setAmendments((previousAmendments) => {
        const value = typeof newValue === "object" ? [...((previousAmendments[key] as []) ?? []), newValue] : newValue
        return { ...previousAmendments, [key]: value }
      })
    },
    []
  )

  courtCaseContext.amendments = amendments

  return courtCaseContext
}

export { CourtCaseContext, useCourtCase }
export type { CourtCaseContextType }
