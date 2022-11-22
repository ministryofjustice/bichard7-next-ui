import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import EditableField from "components/EditableField"
import { Table } from "govuk-react"
import { IndividualAmendmentValues } from "types/Amendments"
import { getOffenceCode } from "./utils"

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
        <Table.Cell>{"Offence Code"}</Table.Cell>
        <Table.Cell>
          {getOffenceCode(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index])}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Title"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].OffenceTitle}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Category"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].OffenceCategory}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Arrest Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ArrestDate?.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Charge Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ChargeDate?.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Date Code"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ActualOffenceDateCode}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Start Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
            index
          ].ActualOffenceStartDate?.StartDate.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Location"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].LocationOfOffence}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Wording"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ActualOffenceWording}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Recordable on PNC"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].RecordableOnPNCindicator}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Notifiable to Home Office"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].NotifiableToHOindicator}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Home Office Classification"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].HomeOfficeClassification}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Conviction Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ConvictionDate?.toString()}
        </Table.Cell>
      </Table.Row>
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
        <Table.Cell>{"Committed on Bail"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].CommittedOnBail}
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
