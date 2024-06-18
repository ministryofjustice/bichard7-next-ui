import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Exception } from "types/exceptions"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import getNextHearingDateValue from "utils/amendments/getAmendmentValues/getNextHearingDateValue"
import isValidNextHearingDate from "utils/validators/isValidNextHearingDate"
import hasNextHearingDateExceptions from "utils/exceptions/hasNextHearingDateExceptions"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"
import SuccessMessage from "components/EditableFields/SuccessMessage"
import ErrorMessage from "components/EditableFields/ErrorMessage"

interface NextHearingDateFieldProps {
  result: Result
  exceptions: Exception[]
  offenceIndex: number
  resultIndex: number
  isCaseEditable: boolean
}

export const NextHearingDateField = ({
  result,
  exceptions,
  offenceIndex,
  resultIndex,
  isCaseEditable
}: NextHearingDateFieldProps) => {
  const { courtCase, amendments, amend, savedAmend } = useCourtCase()
  const currentUser = useCurrentUser()
  const amendedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)

  const [isNhdSaved, setIsNhdSaved] = useState<boolean>(false)
  const [nextHearingDateChanged, setNextHearingDateChanged] = useState<boolean>(false)
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const saveNhd = useCallback(async () => {
    try {
      await axios
        .put(`/bichard/api/court-cases/${courtCase.errorId}/update`, {
          nextHearingDate: amendments.nextHearingDate
        })
        .then((response) => {
          setHttpResponseStatus(response.status)
        })
    } catch (error) {
      setHttpResponseError(error as Error)
    }

    setIsNhdSaved(true)
    setNextHearingDateChanged(false)
  }, [amendments.nextHearingDate, courtCase.errorId])

  const handleNhdSave = useCallback(() => {
    if (!isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate)) {
      return
    }

    saveNhd()
    savedAmend("nextHearingDate")({
      resultIndex: resultIndex,
      offenceIndex: offenceIndex,
      value: amendedNextHearingDate
    })
  }, [amendedNextHearingDate, offenceIndex, result.ResultHearingDate, resultIndex, saveNhd, savedAmend])

  useEffect(() => {
    if (!isNhdSaved && nextHearingDateChanged) {
      handleNhdSave()
    }
  }, [handleNhdSave, isNhdSaved, nextHearingDateChanged])

  const isEditable =
    isCaseEditable && hasNextHearingDateExceptions(exceptions) && currentUser.featureFlags?.exceptionsEnabled

  return (
    <EditableFieldTableRow
      label="Next hearing date"
      hasExceptions={hasNextHearingDateExceptions(exceptions)}
      value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
      updatedValue={updatedNextHearingDate && formatDisplayedDate(updatedNextHearingDate)}
      isEditable={isEditable}
      inputLabel="Enter next hearing date"
      hintText="Enter date"
    >
      <input
        className="govuk-input"
        type="date"
        min={result.ResultHearingDate && formatFormInputDateString(new Date(result.ResultHearingDate))}
        id={"next-hearing-date"}
        name={"next-hearing-date"}
        value={amendedNextHearingDate}
        onChange={(event) => {
          setNextHearingDateChanged(true)
          setIsNhdSaved(false)
          amend("nextHearingDate")({
            resultIndex: resultIndex,
            offenceIndex: offenceIndex,
            value: event.target.value
          })
        }}
      />

      {httpResponseStatus === 202 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </EditableFieldTableRow>
  )
}
