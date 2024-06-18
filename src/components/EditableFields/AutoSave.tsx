import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useCourtCase } from "../../context/CourtCaseContext"
import { AmendmentKeys } from "../../types/Amendments"
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"

interface AutoSaveProps {
  setSaved: (onSave: boolean) => void
  setChanged: (onSave: boolean) => void
  isValid: boolean
  isSaved: boolean
  isChanged: boolean
  amendmentFields: AmendmentKeys[]
}

export const AutoSave = ({ setSaved, setChanged, isValid, isSaved, isChanged, amendmentFields }: AutoSaveProps) => {
  const { courtCase, amendments } = useCourtCase()
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const saveAmendments = useCallback(async () => {
    const map = new Map()

    amendmentFields?.forEach((amendmentField) => map.set(amendmentField, amendments[amendmentField]))

    const update = Object.fromEntries(map)

    try {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, update).then((response) => {
        setHttpResponseStatus(response.status)
      })
    } catch (error) {
      setHttpResponseError(error as Error)
    }

    setSaved(true)
    setChanged(false)
  }, [amendmentFields, amendments, courtCase.errorId, setChanged, setSaved])

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
