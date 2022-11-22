import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"

const HearingTable: React.FC<{ aho: AnnotatedHearingOutcome }> = ({ aho }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"Name"}</Table.CellHeader>
        <Table.CellHeader>{"Value"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Hearing"
  >
    <Table.Row>
      <Table.Cell>{"Court location"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Date of hearing"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing instanceof Date
          ? aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString()
          : aho.AnnotatedHearingOutcome.HearingOutcome.Hearing?.DateOfHearing ?? ""}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Time of hearing"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.TimeOfHearing}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Defendant present"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DefendantPresentAtHearing}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Source reference doc name"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.DocumentName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Source reference Id"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Source reference doc type"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.DocumentType}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court type"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtType}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court house (LJA) code"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court name"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Hearing language"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.HearingLanguage}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Documentation language"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.HearingDocumentationLanguage}</Table.Cell>
    </Table.Row>
  </Table>
)

export default HearingTable
