import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import EditableField from "components/EditableField"
import { Table } from "govuk-react"
import { IndividualAmendmentValues } from "types/Amendments"

const ResultsTable: React.FC<{
  aho: AnnotatedHearingOutcome
  offenceIndex: number
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, offenceIndex, amendFn }) => (
  <>
    {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result.map(
      (_, resultIndex: number) => {
        return (
          <Table
            key={`results-${offenceIndex}`}
            head={
              <Table.Row>
                <Table.CellHeader>{"Name"}</Table.CellHeader>
                <Table.CellHeader>{"Value"}</Table.CellHeader>
              </Table.Row>
            }
            caption="Results"
          >
            <Table.Row>
              <Table.Cell>{"Offence Remand Status"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].OffenceRemandStatus
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Convicting Court"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ]?.ConvictingCourt
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Court Type"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].NextCourtType
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Hearing Time"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].NextHearingTime
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Hearing Date"}</Table.Cell>
              <Table.Cell>
                <EditableField
                  aho={aho}
                  objPath={`AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[${offenceIndex}].Result[${resultIndex}].NextHearingDate`}
                  amendFn={amendFn("nextHearingDate")}
                  relevantIndexes={{ offenceIndex, resultIndex }}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Text"}</Table.Cell>
              <Table.Cell>
                <EditableField
                  aho={aho}
                  objPath={`AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[${offenceIndex}].Result[${resultIndex}].ResultVariableText`}
                  amendFn={amendFn("resultVariableText")}
                  relevantIndexes={{ offenceIndex, resultIndex }}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Reason for Offence Bail Condition"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].ReasonForOffenceBailConditions
                }
              </Table.Cell>
            </Table.Row>
          </Table>
        )
      }
    )}
  </>
)

export default ResultsTable
