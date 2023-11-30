import { createContext, useContext } from "react"
import { DisplayFullCourtCase } from "types/display/CourtCases"

interface CourtCaseContextType {
  courtCase: DisplayFullCourtCase
}

const CourtCaseContext = createContext<CourtCaseContextType | null>(null)

const useCourtCase = (): DisplayFullCourtCase => {
  const courtCaseContext = useContext(CourtCaseContext)

  if (!courtCaseContext) {
    throw new Error("courtCase has to be used within <CourtCaseContext.Provider>")
  }

  return courtCaseContext.courtCase
}

export { CourtCaseContext, useCourtCase }
export type { CourtCaseContextType }
