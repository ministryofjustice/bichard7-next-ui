import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"

interface Props {
  aho: AnnotatedHearingOutcome
}

const HearingOutcome: React.FC<Props> = ({ aho }) => (
  <>
    <HearingTable aho={aho} />
    <CaseTable aho={aho} />
    <DefendantTable aho={aho} />
    <OffencesTable aho={aho} />
  </>
)

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

const CaseTable: React.FC<{ aho: AnnotatedHearingOutcome }> = ({ aho }) => (
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
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court reference"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference?.MagistratesCourtReference}
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

const DefendantTable: React.FC<{ aho: AnnotatedHearingOutcome }> = ({ aho }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"Name"}</Table.CellHeader>
        <Table.CellHeader>{"Value"}</Table.CellHeader>
        <Table.CellHeader>{"Error"}</Table.CellHeader>
        <Table.CellHeader>{"Corrections"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Defendant"
  >
    <Table.Row>
      <Table.Cell>{"ASN"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court PNCID"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier}</Table.Cell>
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

const OffencesTable: React.FC<{ aho: AnnotatedHearingOutcome }> = ({ aho }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"#"}</Table.CellHeader>
        <Table.CellHeader>{"Date"}</Table.CellHeader>
        <Table.CellHeader>{"Code"}</Table.CellHeader>
        <Table.CellHeader>{"Tile"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Offences"
  >
    {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence, index) => {
      return (
        <Table.Row key={index.toString()}>
          <Table.Cell>{index + 1}</Table.Cell>
          {/* TODO: check if this is the correct date for offence */}
          <Table.Cell>{offence.ActualOffenceStartDate.StartDate.toString()}</Table.Cell>
          <Table.Cell>{/* TODO: find the correct offence code*/}</Table.Cell>
          <Table.Cell>{offence.OffenceTitle}</Table.Cell>
        </Table.Row>
      )
    })}
  </Table>
)

export default HearingOutcome
