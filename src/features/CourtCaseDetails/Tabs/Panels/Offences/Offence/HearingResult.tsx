import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import { Duration } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { Durations } from "@moj-bichard7-developers/bichard7-next-data/dist/types/Duration"
import { Table } from "govuk-react"
import { formatDisplayedDate, formatFormInputDateString } from "utils/formattedDate"
import { TableRow } from "../../TableRow"
import pleaStatus from "@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import ExceptionFieldTableRow from "../../../../../../components/ExceptionFieldTableRow"

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

interface HearingResultProps {
  result: Result
  exceptions: ExceptionCode[]
}

export const HearingResult = ({ result, exceptions }: HearingResultProps) => {
  const nextHearinDateException = exceptions.some(
    (code) => code === ExceptionCode.HO100102 || code === ExceptionCode.HO100323
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
      <ConditionalRender isRendered={typeof result.NextResultSourceOrganisation === "string"}>
        <TableRow label="Next hearing location" value={result.NextResultSourceOrganisation?.OrganisationUnitCode} />
      </ConditionalRender>
      <ConditionalRender isRendered={!!result.NextHearingDate || !!nextHearinDateException}>
        {!!nextHearinDateException ? (
          <ExceptionFieldTableRow
            badgeText="Editable Field"
            label="Next hearing date"
            value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
          >
            <input
              className="govuk-input"
              type="date"
              min={result.ResultHearingDate && formatFormInputDateString(new Date(result.ResultHearingDate))}
              id={"next-hearing-date-input"}
              name={"Next"}
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
