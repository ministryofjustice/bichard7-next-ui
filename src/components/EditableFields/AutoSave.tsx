import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useCourtCase } from "../../context/CourtCaseContext"
import { AmendmentKeys, OffenceField, ResultQualifierCode } from "../../types/Amendments"
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"

interface AutoSaveProps {
  setSaved: (onSave: boolean) => void
  setChanged: (onSave: boolean) => void
  isValid: boolean
  isSaved: boolean
  isChanged: boolean
  amendmentFields: AmendmentKeys[]
  children?: React.ReactNode
}

export const AutoSave = ({
  setSaved,
  setChanged,
  isValid,
  isSaved,
  isChanged,
  amendmentFields,
  children
}: AutoSaveProps) => {
  const { courtCase, amendments, savedAmend } = useCourtCase()
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const saveAmendments = useCallback(async () => {
    const map = new Map()

    amendmentFields?.forEach((amendmentField) => map.set(amendmentField, amendments[amendmentField]))

    const update = Object.fromEntries(map)

    try {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, update).then((response) => {
        setHttpResponseStatus(response.status)

        Object.keys(update).forEach((updateKey) => {
          if (Array.isArray(update[updateKey])) {
            update[updateKey].forEach(
              (updatedAmendment: OffenceField<number> | OffenceField<string> | ResultQualifierCode) =>
                savedAmend(updateKey as AmendmentKeys)(updatedAmendment)
            )
          } else {
            savedAmend(updateKey as AmendmentKeys)(update[updateKey])
          }
        })
      })
    } catch (error) {
      setHttpResponseError(error as Error)
    }

    setSaved(true)
    setChanged(false)
  }, [amendmentFields, amendments, courtCase.errorId, savedAmend, setChanged, setSaved])

  useEffect(() => {
    if (!isValid) {
      setHttpResponseStatus(undefined)
    }

    if (!isValid || isSaved || !isChanged) {
      return
    }

    saveAmendments()
  }, [isValid, saveAmendments, isSaved, isChanged])

  return (
    <>
      {children}
      {httpResponseStatus === 202 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </>
  )
}
