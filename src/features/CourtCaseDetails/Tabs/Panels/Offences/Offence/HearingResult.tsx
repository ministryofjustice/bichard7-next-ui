import { Result } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import { TableRow } from "../../TableRow"
import pleaStatus from "@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"

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
  console.log(hours)
  return hours ? `${hours} Hours` : undefined
}

interface HearingResultProps {
  result: Result
}

export const HearingResult = ({ result }: HearingResultProps) => {
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
      <ConditionalRender isRendered={typeof result.NextResultSourceOrganisation === "string"}>
        <TableRow label="Next hearing location" value={result.NextResultSourceOrganisation?.OrganisationUnitCode} />
      </ConditionalRender>
      <ConditionalRender isRendered={result.NextHearingDate !== "false"}>
        <TableRow
          label="Next hearing date"
          value={result.NextHearingDate && formatDisplayedDate(new Date(result.NextHearingDate))}
        />
      </ConditionalRender>
      <TableRow label="Plea" value={getPleaStatus(result.PleaStatus)} />
      <TableRow label="Verdict" value={getVerdict(result.Verdict)} />
      <TableRow label="Mode of trail reason" value={result.ModeOfTrialReason} />
      <TableRow label="Text" value={result.ResultVariableText} />
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
