import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import axios from "axios"
import ConditionalRender from "components/ConditionalRender"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow, { ExceptionBadgeType } from "components/ExceptionFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { Table } from "govuk-react"
import { useCallback, useState } from "react"
import { Amendments } from "types/Amendments"
import { findExceptions } from "types/ErrorMessages"
import { ResolutionStatus } from "types/ResolutionStatus"
import { Exception } from "types/exceptions"
import getNextHearingDateValue from "utils/amendments/getAmendmentValues/getNextHearingDateValue"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import hasNextHearingDateExceptions from "utils/exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"
import isValidNextHearingDate from "utils/validators/isValidNextHearingDate"
import {
  capitaliseExpression,
  formatDuration,
  getNumberOfHours,
  getUrgentYesOrNo,
  getYesOrNo
} from "utils/valueTransformers"
import { TableRow } from "../../TableRow"

interface HearingResultProps {
  result: Result
  exceptions: Exception[]
  resultIndex: number
  selectedOffenceIndex: number
  errorStatus?: ResolutionStatus | null
}

export const HearingResult = ({
  result,
  errorStatus,
  exceptions,
  resultIndex,
  selectedOffenceIndex
}: HearingResultProps) => {
  const { courtCase, amendments, amend } = useCourtCase()
  const cjsErrorMessage = findExceptions(courtCase, exceptions, ExceptionCode.HO100307)

  const offenceIndex = selectedOffenceIndex - 1
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
  const amendedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)

  const isCaseEditable =
    courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME && errorStatus === "Unresolved"

  const [isNhdSaved, setIsNhdSaved] = useState<boolean>(false)
  const [nextHearingDateChanged, setNextHearingDateChanged] = useState<boolean>(false)

  const saveNhd = useCallback(
    async (nhd: Amendments) => {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { nextHearingDate: nhd.nextHearingDate })
      setIsNhdSaved(true)
      setNextHearingDateChanged(false)
    },
    [courtCase.errorId]
  )

  const isSaveNhdBtnDisabled = (): boolean => {
    return (
      !isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate) || isNhdSaved || !nextHearingDateChanged
    )
  }

  const handleNhdSave = () => {
    if (isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate)) {
      saveNhd(amendments)
    }
  }

  return (
    <Table>
      {cjsErrorMessage ? (
        <ExceptionFieldTableRow
          badgeText={ExceptionBadgeType.SystemError}
          value={result.CJSresultCode}
          label={"CJS Code"}
        >
          <ErrorPromptMessage message={cjsErrorMessage} />
        </ExceptionFieldTableRow>
      ) : (
        <TableRow label="CJS Code" value={result.CJSresultCode} />
      )}
      <TableRow
        label="Result hearing type"
        value={result.ResultHearingType && capitaliseExpression(result.ResultHearingType)}
      />
      <TableRow
        label="Result hearing date"
        value={result.ResultHearingDate && formatDisplayedDate(new Date(result.ResultHearingDate))}
      />
      <ConditionalRender isRendered={typeof result.Duration !== "undefined" && result.Duration?.length > 0}>
        <TableRow
          label="Duration"
          value={
            <>
              {result.Duration?.map((duration) => (
                <div key={`duration-${duration.DurationLength}-${duration.DurationUnit}`}>
                  {formatDuration(duration.DurationLength, duration.DurationUnit)}
                </div>
              ))}
            </>
          }
        />
      </ConditionalRender>
      <EditableFieldTableRow
        label="Next hearing location"
        hasExceptions={hasNextHearingLocationException(exceptions)}
        value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
        updatedValue={updatedNextHearingLocation}
        isEditable={isCaseEditable && hasNextHearingLocationException(exceptions)}
        inputLabel="Enter next hearing location"
        hintText="OU code, 6-7 characters"
      >
        <OrganisationUnitTypeahead
          value={
            amendedNextHearingLocation ??
            updatedNextHearingLocation ??
            result.NextResultSourceOrganisation?.OrganisationUnitCode
          }
          resultIndex={resultIndex}
          offenceIndex={offenceIndex}
        />
      </EditableFieldTableRow>
      <EditableFieldTableRow
        label="Next hearing date"
        hasExceptions={hasNextHearingDateExceptions(exceptions)}
        value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
        updatedValue={updatedNextHearingDate && formatDisplayedDate(updatedNextHearingDate)}
        isEditable={isCaseEditable && hasNextHearingDateExceptions(exceptions)}
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

        {/*
          Save button
            - Valid date is in the future
            - Axois request
              - Can we create a pattern to handle all updates e.g. ASN
              - Doesn't all amendemts, only saves the one we press
        */}
      </EditableFieldTableRow>
      <TableRow label="Mode of trial reason" value={result.ModeOfTrialReason} />
      <TableRow label="Hearing result text" value={result.ResultVariableText} />
      <TableRow label="PNC disposal type" value={result.PNCDisposalType} />
      <TableRow label="Result class" value={result.ResultClass} />
      <TableRow label="PNC adjudication exists" value={getYesOrNo(result.PNCAdjudicationExists)} />

      <ConditionalRender isRendered={typeof result.Urgent !== "undefined"}>
        <TableRow label="Urgent" value={getUrgentYesOrNo(result.Urgent?.urgent)} />
        <TableRow label="Urgency" value={getNumberOfHours(result.Urgent?.urgency)} />
      </ConditionalRender>
    </Table>
  )
}
