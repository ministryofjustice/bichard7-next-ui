import DateTime from "components/DateTime"
import If from "components/If"
import CourtCase from "entities/CourtCase"
import { Heading, Paragraph, Table } from "govuk-react"

interface Props {
  courtCase: CourtCase
}

const CourtCaseDetails: React.FC<Props> = ({ courtCase }) => (
  <>
    <Heading as="h2" size="LARGE">
      {"Case Details"}
    </Heading>
    <Table>
      <Table.Row>
        <Table.CellHeader>{"PTIURN"}</Table.CellHeader>
        <Table.Cell>{courtCase.ptiurn}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Court name"}</Table.CellHeader>
        <Table.Cell>{courtCase.courtName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Court date"}</Table.CellHeader>
        <Table.Cell>
          <DateTime date={courtCase.courtDate} />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Defendant name"}</Table.CellHeader>
        <Table.Cell>{courtCase.defendantName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Exception reason"}</Table.CellHeader>
        <Table.Cell>{courtCase.errorReason}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Trigger reason"}</Table.CellHeader>
        <Table.Cell>{courtCase.triggerReason}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Hearing OU"}</Table.CellHeader>
        <Table.Cell>{"Implement me!"}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>{"Organisation Unit Code"}</Table.CellHeader>
        <Table.Cell>
          {
            courtCase.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation
              .OrganisationUnitCode
          }
        </Table.Cell>
      </Table.Row>
    </Table>
    <Heading as="h3" size="MEDIUM">
      {"Triggers"}
    </Heading>
    <If condition={(courtCase?.triggers?.length ?? 0) > 0}>
      <Table>
        <Table.Row>
          <Table.CellHeader>{"Code"}</Table.CellHeader>
          <Table.CellHeader>{"Item ID"}</Table.CellHeader>
          <Table.CellHeader>{"Resolved by"}</Table.CellHeader>
          <Table.CellHeader>{"Resolved at"}</Table.CellHeader>
        </Table.Row>
        {courtCase.triggers.map((trigger, index) => (
          <Table.Row key={index}>
            <Table.Cell>{trigger.triggerCode}</Table.Cell>
            <Table.Cell>{trigger.triggerItemIdentity}</Table.Cell>
            <Table.Cell>{trigger.resolvedBy}</Table.Cell>
            <Table.Cell>
              <DateTime date={trigger.createdAt} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </If>
    <If condition={(courtCase?.triggers?.length ?? 0) === 0}>
      <Paragraph>{"Case has no triggers."}</Paragraph>
    </If>
    <Heading as="h3" size="MEDIUM">
      {"Notes"}
    </Heading>
    <If condition={(courtCase?.notes?.length ?? 0) > 0}>
      <Table>
        {courtCase.notes.map((note, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <DateTime date={note.createdAt} />
            </Table.Cell>
            <Table.Cell>{note.noteText}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </If>
    <If condition={(courtCase?.notes?.length ?? 0) === 0}>
      <Paragraph>{"Case has no notes."}</Paragraph>
    </If>
  </>
)

export default CourtCaseDetails
