import { useCallback, useEffect, useState } from "react"
import { AmendmentKeys } from "../../types/Amendments"
import axios from "axios"
import SuccessMessage from "./SuccessMessage"
import ErrorMessage from "./ErrorMessage"
import { useCourtCase } from "../../context/CourtCaseContext"

interface AutoSaveProps {
  setSaved: (onSave: boolean) => void
  setChanged: (onSave: boolean) => void
  isValid: boolean
  isSaved: boolean
  isChanged: boolean
  amendmentField: AmendmentKeys
}

export const AutoSave = ({ setSaved, setChanged, isValid, isSaved, isChanged, amendmentField }: AutoSaveProps) => {
  const { courtCase, amendments } = useCourtCase()
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const saveAmendments = useCallback(async () => {
    try {
      await axios
        .put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { amendmentField: amendments[amendmentField] })
        .then((response) => {
          setHttpResponseStatus(response.status)
        })
    } catch (error) {
      setHttpResponseError(error as Error)
    }

    setSaved(true)
    setChanged(false)
  }, [amendmentField, amendments, courtCase.errorId, setChanged, setSaved])

  useEffect(() => {
    if (!isValid || isSaved || !isChanged) {
      return
    }

    saveAmendments()
  }, [isValid, saveAmendments, isSaved, isChanged])

  return (
    <>
      {httpResponseStatus === 202 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </>
  )
}
