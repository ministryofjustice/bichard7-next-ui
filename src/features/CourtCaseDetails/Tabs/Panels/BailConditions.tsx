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
          offence: `Offence ${
            offences.filter((offence) =>
              offence.Result.filter((res) => res.ResultVariableText?.includes(bailCondition))
            )[0].CourtOffenceSequenceNumber
          }`
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
            hintText={condition.offence}
            value={condition.value}
          />
        ))}
        {bailReason && <TableRow label="Bail reason" value={bailReason} />}
      </Table>
    </ConditionalRender>
  )
}
