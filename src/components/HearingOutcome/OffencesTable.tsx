import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { IndividualAmendmentValues } from "types/Amendments"
import { getOffenceCode } from "./utils"
import OffenceDetails from "./OffenceDetails"
import ResultsTable from "./ResultsTable"

const OffencesTable: React.FC<{
  aho: AnnotatedHearingOutcome
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, amendFn }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"#"}</Table.CellHeader>
        <Table.CellHeader>{"Date"}</Table.CellHeader>
        <Table.CellHeader>{"Code"}</Table.CellHeader>
        <Table.CellHeader>{"Title"}</Table.CellHeader>
        <Table.CellHeader>{"Details"}</Table.CellHeader>
        <Table.CellHeader>{"Results"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Offences"
  >
    {aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence?.length > 0 &&
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence, index) => {
        return (
          <Table.Row key={`offence-${index}`}>
            <Table.Cell>{index + 1}</Table.Cell>
            {/* TODO: check if this is the correct date for offence */}
            <Table.Cell>{offence.ActualOffenceStartDate.StartDate.toString()}</Table.Cell>
            <Table.Cell>{getOffenceCode(offence)}</Table.Cell>
            <Table.Cell>{offence.OffenceTitle}</Table.Cell>

            <Table.Cell>
              <OffenceDetails aho={aho} index={index} amendFn={amendFn} />
            </Table.Cell>
            <Table.Cell>
              <ResultsTable aho={aho} offenceIndex={index} amendFn={amendFn} />
            </Table.Cell>
          </Table.Row>
        )
      })}
  </Table>
)

export default OffencesTable
