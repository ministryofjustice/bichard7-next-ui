import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Exception } from "types/exceptions"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import getNextHearingDateValue from "utils/amendments/getAmendmentValues/getNextHearingDateValue"
import isValidNextHearingDate from "utils/validators/isValidNextHearingDate"
import hasNextHearingDateExceptions from "utils/exceptions/hasNextHearingDateExceptions"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"

interface NextHearingDateFieldProps {
  result: Result
  exceptions: Exception[]
  offenceIndex: number
  resultIndex: number
  isCaseEditable: boolean
  stopLeavingFn: (newValue: boolean) => void
}

export const NextHearingDateField = ({
  result,
  exceptions,
  offenceIndex,
  resultIndex,
  isCaseEditable,
  stopLeavingFn
}: NextHearingDateFieldProps) => {
  const { courtCase, amendments, amend, savedAmend } = useCourtCase()
  const currentUser = useCurrentUser()
  const amendedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)

  const [isNhdSaved, setIsNhdSaved] = useState<boolean>(false)
  const [nextHearingDateChanged, setNextHearingDateChanged] = useState<boolean>(false)

  const saveNhd = useCallback(async () => {
    await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, {
      nextHearingDate: amendments.nextHearingDate
    })
    setIsNhdSaved(true)
    setNextHearingDateChanged(false)
  }, [amendments.nextHearingDate, courtCase.errorId])

  const isSaveNhdBtnDisabled = (): boolean => {
    return (
      !isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate) || isNhdSaved || !nextHearingDateChanged
    )
  }

  useEffect(() => {
    stopLeavingFn(!isNhdSaved && nextHearingDateChanged)
  }, [isNhdSaved, nextHearingDateChanged, stopLeavingFn])

  const handleNhdSave = () => {
    if (isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate)) {
      saveNhd()
      savedAmend("nextHearingDate")({
        resultIndex: resultIndex,
        offenceIndex: offenceIndex,
        value: amendedNextHearingDate
      })
    }
  }

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

      <SaveLinkButton id={"save-next-hearing-date"} onClick={handleNhdSave} disabled={isSaveNhdBtnDisabled()} />
    </EditableFieldTableRow>
  )
}
