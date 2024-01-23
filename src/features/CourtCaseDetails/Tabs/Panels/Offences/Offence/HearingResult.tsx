import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import ConditionalRender from "components/ConditionalRender"
import EditableFieldTableRow from "components/EditableFieldTableRow"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { HintText, Label, Table } from "govuk-react"
import { AmendmentKeys, AmendmentRecords, IndividualAmendmentValues } from "types/Amendments"
import { findExceptions } from "types/ErrorMessages"
import { ResolutionStatus } from "types/ResolutionStatus"
import { Exception } from "types/exceptions"
import getNextHearingDateValue from "utils/amendments/getAmendmentValues/getNextHearingDateValue"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import hasNextHearingDateException from "utils/exceptions/hasNextHearingDateException"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"
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
  updatedFields: AmendmentRecords
  exceptions: Exception[]
  resultIndex: number
  selectedOffenceIndex: number
  amendments: AmendmentRecords
  errorStatus?: ResolutionStatus | null
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
}

export const HearingResult = ({
  result,
  updatedFields,
  errorStatus,
  exceptions,
  resultIndex,
  selectedOffenceIndex,
  amendments,
  amendFn
}: HearingResultProps) => {
  const courtCase = useCourtCase()
  const cjsErrorMessage = findExceptions(courtCase, exceptions, ExceptionCode.HO100307)

  const offenceIndex = selectedOffenceIndex - 1
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
  const amendedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingLocation = getNextHearingLocationValue(updatedFields, offenceIndex, resultIndex)
  const updatedNextHearingDate = getNextHearingDateValue(updatedFields, offenceIndex, resultIndex)

  return (
    <Table>
      {cjsErrorMessage ? (
        <ExceptionFieldTableRow badgeText={"System Error"} value={result.CJSresultCode} label={"CJS Code"}>
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
        errorStatus={errorStatus}
        value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
        updatedValue={updatedNextHearingLocation}
      >
        <Label>{"Enter next hearing location"}</Label>
        <HintText>{"OU code, 6-7 characters"}</HintText>
        <OrganisationUnitTypeahead
          value={
            amendedNextHearingLocation === undefined
              ? updatedNextHearingLocation || result.NextResultSourceOrganisation?.OrganisationUnitCode
              : amendedNextHearingLocation
          }
          amendFn={amendFn}
          resultIndex={resultIndex}
          offenceIndex={offenceIndex}
        />
      </EditableFieldTableRow>
      <EditableFieldTableRow
        label="Next hearing date"
        hasExceptions={hasNextHearingDateException(exceptions)}
        errorStatus={errorStatus}
        value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
        updatedValue={updatedNextHearingDate && formatDisplayedDate(updatedNextHearingDate)}
      >
        <HintText>{"Enter date"}</HintText>
        <input
          className="govuk-input"
          type="date"
          min={result.ResultHearingDate && formatFormInputDateString(new Date(result.ResultHearingDate))}
          id={"next-hearing-date"}
          name={"next-hearing-date"}
          value={amendedNextHearingDate}
          onChange={(event) => {
            amendFn("nextHearingDate")({
              resultIndex: resultIndex,
              offenceIndex: offenceIndex,
              updatedValue: event.target.value
            })
          }}
        />
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
