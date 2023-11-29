import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import { Duration } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { Durations } from "@moj-bichard7-developers/bichard7-next-data/dist/types/Duration"
import { HintText, Table } from "govuk-react"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"
import { TableRow } from "../../TableRow"
import pleaStatus from "@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import ExceptionFieldTableRow from "../../../../../../components/ExceptionFieldTableRow"
import {
  AmendmentKeys,
  AmendmentRecords,
  IndividualAmendmentValues,
  UpdatedNextHearingDate
} from "../../../../../../types/Amendments"
import { Exception } from "../../../../../../types/exceptions"

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

const getNextHearingDateValue = (
  amendmentRecords: AmendmentRecords,
  offenceIndex: number,
  resultIndex: number
): string => {
  const nextHearingDateAmendment =
    amendmentRecords?.nextHearingDate &&
    (amendmentRecords.nextHearingDate as UpdatedNextHearingDate[]).find(
      (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
    )?.updatedValue

  return nextHearingDateAmendment ? formatFormInputDateString(new Date(nextHearingDateAmendment)) : ""
}

interface HearingResultProps {
  result: Result
  exceptions: Exception[]
  resultIndex: number
  selectedOffenceIndex: number
  amendments: AmendmentRecords
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
}

export const HearingResult = ({
  result,
  exceptions,
  resultIndex,
  selectedOffenceIndex,
  amendments,
  amendFn
}: HearingResultProps) => {
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

  return (
    <Table>
      <TableRow label="CJS Code" value={result.CJSresultCode} />
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
            nextHearingLocationException
          )
        }
      >
        <TableRow label="Next hearing location" value={result.NextResultSourceOrganisation?.OrganisationUnitCode} />
      </ConditionalRender>
      <ConditionalRender isRendered={!!result.NextHearingDate || !!nextHearingDateException}>
        {!!nextHearingDateException ? (
          <ExceptionFieldTableRow
            badgeText="Editable Field"
            label="Next hearing date"
            value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
          >
            <HintText>{"Enter date"}</HintText>
            <input
              className="govuk-input"
              type="date"
              min={result.ResultHearingDate && formatFormInputDateString(new Date(result.ResultHearingDate))}
              id={"next-hearing-date"}
              name={"next-hearing-date"}
              value={getNextHearingDateValue(amendments, selectedOffenceIndex - 1, resultIndex)}
              onChange={(event) => {
                amendFn("nextHearingDate")({
                  resultIndex: resultIndex,
                  offenceIndex: selectedOffenceIndex - 1, //Displayed offence for navigation is not 0 indexed,
                  updatedValue: event.target.value
                })
              }}
            />
          </ExceptionFieldTableRow>
        ) : (
          <TableRow label={"Next hearing date"} value={formatDisplayedDate(String(result.NextHearingDate))} />
        )}
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
