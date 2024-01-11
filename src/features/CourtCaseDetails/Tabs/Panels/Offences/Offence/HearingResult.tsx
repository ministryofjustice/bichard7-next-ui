import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import pleaStatus from "@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import { Durations } from "@moj-bichard7-developers/bichard7-next-data/dist/types/Duration"
import { Duration } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { HintText, Label, Table } from "govuk-react"
import { findExceptions } from "types/ErrorMessages"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"
import EditableFieldTableRow from "../../../../../../components/EditableFieldTableRow"
import {
  AmendmentKeys,
  AmendmentRecords,
  IndividualAmendmentValues,
  UpdatedNextHearingDate,
  UpdatedOffenceResult
} from "../../../../../../types/Amendments"
import { ResolutionStatus } from "../../../../../../types/ResolutionStatus"
import { Exception } from "../../../../../../types/exceptions"
import { TableRow } from "../../TableRow"

export const getYesOrNo = (code: boolean | undefined) => {
  return code === true ? "Y" : code === false ? "N" : undefined
}

export const capitaliseExpression = (expression: string) => {
  return expression.charAt(0).toUpperCase() + expression.slice(1).toLowerCase()
}

export const getUrgentYesOrNo = (urgent: boolean | undefined): string => {
  return urgent === true ? "Y" : "N"
}

export const getNumberOfHours = (hours: number | undefined): string | undefined => {
  return hours ? `${hours} Hours` : undefined
}

export const formatDuration = (durationLength: number, durationUnit: string): string => {
  return `${durationLength} ${Durations[durationUnit as Duration]}`
}

const getPleaStatus = (pleaCode: string | undefined) => {
  let pleaStatusDescription = pleaCode
  pleaStatus.forEach((plea) => {
    if (plea.cjsCode === pleaCode) {
      pleaStatusDescription = `${pleaCode} (${capitaliseExpression(plea.description)})`
    }
  })
  return pleaStatusDescription
}

const getVerdict = (verdictCode: string | undefined) => {
  let verdictDescription = verdictCode
  verdicts.forEach((verdict) => {
    if (verdict.cjsCode === verdictCode) {
      verdictDescription = `${verdictCode} (${capitaliseExpression(verdict.description)})`
    }
  })
  return verdictDescription
}

const getNextHearingDateValue = (
  amendmentRecords: AmendmentRecords,
  offenceIndex: number,
  resultIndex: number
): string | undefined => {
  const validDateFormat = /^20\d{2}-\d{2}-\d{2}$/
  const nextHearingDateAmendment =
    amendmentRecords?.nextHearingDate &&
    (amendmentRecords.nextHearingDate as UpdatedNextHearingDate[]).find(
      (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
    )?.updatedValue

  if (!nextHearingDateAmendment) {
    return ""
  }

  return validDateFormat.test(nextHearingDateAmendment) ? nextHearingDateAmendment : undefined
}

const getNextHearingLocationValue = (
  amendmentRecords: AmendmentRecords,
  offenceIndex: number,
  resultIndex: number
): string | undefined =>
  amendmentRecords?.nextSourceOrganisation &&
  (amendmentRecords.nextSourceOrganisation as UpdatedOffenceResult[]).find(
    (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
  )?.updatedValue

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
  const cjsErrorPrompt = findExceptions(courtCase, exceptions, ExceptionCode.HO100307)

  const offenceIndex = selectedOffenceIndex - 1
  const updatedNextHearingLocation = getNextHearingLocationValue(updatedFields, offenceIndex, resultIndex)
  const updatedNextHearingDate = getNextHearingDateValue(updatedFields, offenceIndex, resultIndex)
  const nextHearingDateException = exceptions.some(
    (exception) =>
      exception.path.join(".").endsWith(".NextHearingDate") &&
      (exception.code === ExceptionCode.HO100102 || exception.code === ExceptionCode.HO100323)
  )

  const nextHearingLocationException = exceptions.some(
    (exception) =>
      exception.path.join(".").endsWith(".NextResultSourceOrganisation.OrganisationUnitCode") &&
      (exception.code === ExceptionCode.HO100200 ||
        exception.code === ExceptionCode.HO100300 ||
        exception.code === ExceptionCode.HO100322)
  )

  return (
    <Table>
      {cjsErrorPrompt ? (
        <ExceptionFieldTableRow badgeText={"System Error"} value={result.CJSresultCode} label={"CJS code"}>
          <ErrorPromptMessage message={cjsErrorPrompt} />
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
      <ConditionalRender
        isRendered={
          !!(
            (result.NextResultSourceOrganisation && result.NextResultSourceOrganisation?.OrganisationUnitCode) ||
            updatedNextHearingLocation ||
            nextHearingLocationException
          )
        }
      >
        <EditableFieldTableRow
          label="Next hearing location"
          isEditable={nextHearingLocationException && errorStatus === "Unresolved"}
          value={result.NextResultSourceOrganisation && result.NextResultSourceOrganisation?.OrganisationUnitCode}
          updatedValue={updatedNextHearingLocation}
        >
          <Label>{"Enter next hearing location"}</Label>
          <HintText>{"OU code, 6-7 characters"}</HintText>
          <OrganisationUnitTypeahead
            value={
              getNextHearingLocationValue(amendments, offenceIndex, resultIndex) === undefined
                ? updatedNextHearingLocation || result.NextResultSourceOrganisation?.OrganisationUnitCode
                : getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
            }
            amendFn={amendFn}
            resultIndex={resultIndex}
            offenceIndex={offenceIndex}
          />
        </EditableFieldTableRow>
      </ConditionalRender>
      <ConditionalRender
        isRendered={!!result.NextHearingDate || !!updatedNextHearingDate || !!nextHearingDateException}
      >
        <EditableFieldTableRow
          label="Next hearing date"
          isEditable={nextHearingDateException && errorStatus === "Unresolved"}
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
            value={getNextHearingDateValue(amendments, offenceIndex, resultIndex)}
            onChange={(event) => {
              amendFn("nextHearingDate")({
                resultIndex: resultIndex,
                offenceIndex: offenceIndex,
                updatedValue: event.target.value
              })
            }}
          />
        </EditableFieldTableRow>
      </ConditionalRender>
      <TableRow label="Plea" value={getPleaStatus(result.PleaStatus)} />
      <TableRow label="Verdict" value={getVerdict(result.Verdict)} />
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
