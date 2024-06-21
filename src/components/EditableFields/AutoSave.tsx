import axios from "axios"
import { isEmpty, isEqual } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { useCourtCase } from "../../context/CourtCaseContext"
import { AmendmentKeys, Amendments, OffenceField, ResultQualifierCode } from "../../types/Amendments"
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

const excludeSavedAmendments = (
  amendmentFields: AmendmentKeys[],
  amendments: Amendments,
  savedAmendments: Amendments
) => {
  const map = new Map()

  amendmentFields?.forEach((amendmentField) => {
    if (Array.isArray(amendments[amendmentField])) {
      const newValues: (OffenceField<number> | OffenceField<string> | ResultQualifierCode)[] = []
      const amendmentsArray =
        (amendments[amendmentField] as OffenceField<number>[] | OffenceField<string>[] | ResultQualifierCode[]) ?? []
      const savedAmendmentsArray =
        (savedAmendments[amendmentField] as OffenceField<number>[] | OffenceField<string>[] | ResultQualifierCode[]) ??
        []

      amendmentsArray.forEach((amendment) => {
        const matchedSaved = savedAmendmentsArray.find(
          (saveAmendment) => amendment.offenceIndex === saveAmendment.offenceIndex
        )

        if (!isEqual(amendment, matchedSaved)) {
          newValues.push(amendment)
        }
      })

      map.set(amendmentField, newValues)
    } else if (!isEqual(amendments[amendmentField], savedAmendments[amendmentField])) {
      map.set(amendmentField, amendments[amendmentField])
    }
  })

  return Object.fromEntries(map)
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
  const { courtCase, amendments, savedAmend, savedAmendments, updateCourtCase } = useCourtCase()
  const [saving, setSaving] = useState<boolean>(false)
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const saveAmendments = useCallback(async () => {
    if (saving) {
      return
    }
    setSaving(true)

    const update = excludeSavedAmendments(amendmentFields, amendments, savedAmendments)

    try {
      if (isEmpty(update)) {
        setSaving(false)
        setSaved(true)
        setChanged(false)
        return
      }
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

        updateCourtCase(response.data.courtCase as DisplayFullCourtCase)
      })
    } catch (error) {
      setHttpResponseError(error as Error)
    } finally {
      setSaving(false)
    }

    setSaved(true)
    setChanged(false)
  }, [
    amendmentFields,
    amendments,
    courtCase.errorId,
    savedAmend,
    savedAmendments,
    saving,
    setChanged,
    setSaved,
    updateCourtCase
  ])

  useEffect(() => {
    if (!isValid) {
      setHttpResponseStatus(undefined)
      return
    }

    if (isSaved || !isChanged) {
      return
    }

    saveAmendments()
  }, [isValid, saveAmendments, isSaved, isChanged])

  return (
    <>
      {children}
      {httpResponseStatus === 200 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </>
  )
}
