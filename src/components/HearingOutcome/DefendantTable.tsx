import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import EditableField from "components/EditableField"
import { Table } from "govuk-react"
import { IndividualAmendmentValues } from "types/Amendments"

const DefendantTable: React.FC<{
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
    caption="Defendant"
  >
    <Table.Row>
      <Table.Cell>{"ASN"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber"
          amendFn={amendFn("asn")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court PNCID"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier"
          amendFn={amendFn("courtPNCIdentifier")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Title"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.Title}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Given name"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.GivenName}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Family name"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.FamilyName}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"PNC filename"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.GeneratedPNCFilename}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Birthdate"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate instanceof Date
          ? aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate.toString()
          : aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate ?? ""}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Gender"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.Gender}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Address line 1"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address.AddressLine1}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Address line 2"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address.AddressLine2}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Remand status"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.RemandStatus}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Bail condition"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Bail reason"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ReasonForBailConditions}
      </Table.Cell>
    </Table.Row>
  </Table>
)

export default DefendantTable
