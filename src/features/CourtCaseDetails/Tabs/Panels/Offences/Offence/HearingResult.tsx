import { Result } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import { TableRow } from "../../TableRow"

export const getYesOrNo = (code: boolean | undefined) => {
  return code === true ? "Y" : code === false ? "N" : undefined
}

export const capitaliseExpression = (expression: string) => {
  return expression.charAt(0).toUpperCase() + expression.slice(1).toLowerCase()
}

interface HearingResultProps {
  result: Result
}

export const HearingResult = ({ result }: HearingResultProps) => (
  <Table>
    <TableRow header="CJS Code" value={result.CJSresultCode} />
    <TableRow
      header="Result hearing type"
      value={result.ResultHearingType && capitaliseExpression(result.ResultHearingType)}
    />
    <TableRow
      header="Result hearing date"
      value={result.ResultHearingDate && formatDisplayedDate(new Date(result.ResultHearingDate))}
    />
    <TableRow
      header="Next hearing location"
      value={
        typeof result.NextResultSourceOrganisation === "string" ? result.NextResultSourceOrganisation : "Not entered"
      }
    />
    <TableRow
      header="Next hearing date"
      value={result.NextHearingDate ? formatDisplayedDate(new Date(result.NextHearingDate)) : "Not entered"}
    />
    <TableRow header="Plea" value={result.PleaStatus} />
    <TableRow header="Verdict" value={result.Verdict} />
    <TableRow header="Mode of trail reason" value={result.ModeOfTrialReason} />
    <TableRow header="Text" value={result.ResultVariableText} />
    <TableRow header="PNC disposal type" value={result.PNCDisposalType} />
    <TableRow header="Result class" value={result.ResultClass} />
    <TableRow header="PNC adjudication exists" value={getYesOrNo(result.PNCAdjudicationExists)} />
  </Table>
)
