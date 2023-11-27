import { createContext, useContext } from "react"
import { DisplayFullCourtCase } from "types/display/CourtCases"

interface CourtCaseContextType {
  courtCase: DisplayFullCourtCase
}

const CourtCaseContext = createContext<CourtCaseContextType | null>(null)

const useCourtCaseContext = () => {
  const courtCaseContext = useContext(CourtCaseContext)

  if (!courtCaseContext) {
    throw new Error("courtCase has to be used within <CourtCaseContextType>")
  }

  return courtCaseContext
}

export { CourtCaseContext, useCourtCaseContext }
export type { CourtCaseContextType }
