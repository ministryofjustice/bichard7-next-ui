import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from "react"
import { Amender, Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import getAmendmentsByComparison from "utils/getAmendmentsByComparison"

export interface CourtCaseContextType {
  courtCase: DisplayFullCourtCase
  amendments: Amendments
  savedAmendments: Amendments
}

export interface CourtCaseContextResult {
  courtCase: DisplayFullCourtCase
  amendments: Amendments
  savedAmendments: Amendments
  amend: Amender
  savedAmend: Amender
  updateCourtCase: (courtCase: DisplayFullCourtCase) => void
}

type CourtCaseContextInput = [CourtCaseContextType, Dispatch<SetStateAction<CourtCaseContextType>>]

const upsertFunction = <T extends Record<string, unknown>>(previousValues: T[], value: T): T[] => {
  const keys = Object.keys(value).filter((key) => key !== "value")
  const hasValue = (previousValue: T, newValue: T) =>
    keys.filter((key) => previousValue?.[key] === newValue[key]).length === keys.length
  const amendmentsWithoutOldValue = (previousValues || []).filter((previousValue) => !hasValue(previousValue, value))

  return [...amendmentsWithoutOldValue, value]
}

const upsertAmendments = upsertFunction
const upsertSavedAmendments = upsertFunction

const CourtCaseContext = createContext<CourtCaseContextInput | null>(null)

const useCourtCase = (): CourtCaseContextResult => {
  const courtCaseContextState = useContext(CourtCaseContext)

  if (!courtCaseContextState) {
    throw new Error("courtCase has to be used within <CourtCaseContext.Provider>")
  }

  const [context, setContext] = courtCaseContextState

  const updateCourtCase = useCallback(
    (newCourtCase: DisplayFullCourtCase) => {
      setContext((previousContext) => {
        return { ...previousContext, courtCase: newCourtCase }
      })
    },
    [setContext]
  )

  const amend: Amender = useCallback(
    (key) => (newValue) => {
      setContext((previousContext) => {
        const { amendments } = previousContext
        const value =
          typeof newValue === "object"
            ? upsertAmendments(amendments[key] as Record<string, unknown>[], newValue)
            : newValue
        const newAmendments = { ...amendments, [key]: value }

        return { ...previousContext, amendments: newAmendments }
      })
    },
    [setContext]
  )

  const savedAmend: Amender = useCallback(
    (key) => (newValue) => {
      setContext((previousContext) => {
        const { amendments } = previousContext
        const value =
          typeof newValue === "object"
            ? upsertSavedAmendments(amendments[key] as Record<string, unknown>[], newValue)
            : newValue
        const newSavedAmendments = { ...amendments, [key]: value }

        return { ...previousContext, savedAmendments: newSavedAmendments }
      })
    },
    [setContext]
  )

  return {
    courtCase: context.courtCase,
    amendments: context.amendments,
    savedAmendments: context.savedAmendments,
    amend,
    savedAmend,
    updateCourtCase
  }
}

const useCourtCaseContextState = (courtCase: DisplayFullCourtCase) =>
  useState<CourtCaseContextType>({
    courtCase,
    amendments: getAmendmentsByComparison(courtCase.aho, courtCase.updatedHearingOutcome),
    savedAmendments: getAmendmentsByComparison(courtCase.aho, courtCase.updatedHearingOutcome)
  })

CourtCaseContext.displayName = "CourtCaseContext"

export { CourtCaseContext, useCourtCase, useCourtCaseContextState }
