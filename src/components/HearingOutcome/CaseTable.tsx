import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import EditableField from "components/EditableField"
import { IndividualAmendmentValues } from "types/Amendments"
import { Table } from "govuk-react"

const CaseTable: React.FC<{
  aho: AnnotatedHearingOutcome
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, amendFn }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"Name"}</Table.CellHeader>
        <Table.CellHeader>{"Value"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Case"
  >
    <Table.Row>
      <Table.Cell>{"PTIURN"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Force owner"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.OrganisationUnitCode"
          amendFn={amendFn("forceOwner")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court reference"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference"
          amendFn={amendFn("courtReference")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Notifiable to PNC"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Pre Decision Indicator"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.PreChargeDecisionIndicator}</Table.Cell>
    </Table.Row>
  </Table>
)

export default CaseTable
