import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import EditableField from "components/EditableField"
import { Table } from "govuk-react"
import { IndividualAmendmentValues } from "types/Amendments"
import getOffenceCode from "utils/getOffenceCode"

const OffenceDetails: React.FC<{
  aho: AnnotatedHearingOutcome
  index: number
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, index, amendFn }) =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index] && (
    <Table
      key={`offence-details-${index}`}
      head={
        <Table.Row>
          <Table.CellHeader>{"Name"}</Table.CellHeader>
          <Table.CellHeader>{"Value"}</Table.CellHeader>
        </Table.Row>
      }
      caption="Offence Details"
    >
      <Table.Row>
        <Table.Cell>{"Court Offence Sequence Number"}</Table.Cell>
        <Table.Cell>
          <EditableField
            aho={aho}
            objPath={`AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[${index}].CourtOffenceSequenceNumber`}
            amendFn={amendFn("courtOffenceSequenceNumber")}
            relevantIndexes={{ offenceIndex: index }}
          />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Added by the Court"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].AddedByTheCourt}
        </Table.Cell>
      </Table.Row>
    </Table>
  )

export default OffenceDetails
