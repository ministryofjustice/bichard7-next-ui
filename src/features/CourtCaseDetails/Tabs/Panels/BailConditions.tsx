import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { H3, Table } from "govuk-react"
import { TableRow } from "./TableRow"
import ConditionalRender from "../../../../components/ConditionalRender"

interface BailConditionsProps {
  bailConditions?: string[]
  bailReason?: string
  offences: Offence[]
}

export const BailConditions = ({ bailConditions, bailReason, offences }: BailConditionsProps) => {
  const conditions = bailConditions
    ? bailConditions.map((bailCondition) => {
        const conditionWithLabel = bailCondition.match(/^\s*([^:]+):\s*(.*)$/)
        return {
          label: conditionWithLabel ? conditionWithLabel[1].trim() : "Other",
          value: bailCondition,
          offenceIndex: offences
            .map(
              (offence) =>
                offence.Result.some((res) => res.ResultVariableText?.includes(bailCondition)) &&
                offence.CourtOffenceSequenceNumber
            )
            .filter((courtOffenceSequenceNumber) => !!courtOffenceSequenceNumber)[0]
        }
      })
    : []
  return (
    <ConditionalRender isRendered={conditions.length > 0}>
      <p />
      <H3>{"Bail conditions"}</H3>
      <Table>
        {conditions.map((condition, i) => (
          <TableRow
            key={`bail-condition-${i}`}
            label={condition.label}
            hintText={condition.offenceIndex ? `Offence ${condition.offenceIndex}` : ""}
            value={condition.value}
          />
        ))}
        {bailReason && <TableRow label="Bail reason" value={bailReason} />}
      </Table>
    </ConditionalRender>
  )
}
