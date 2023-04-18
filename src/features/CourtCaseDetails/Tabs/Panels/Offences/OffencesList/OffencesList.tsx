import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"

import getOffenceCode from "utils/getOffenceCode"
import { OffencesListRow } from "./OffencesListRow"

interface OffencesListProps {
  offences: Offence[]
  setDetailedOffence: (offence: Offence) => void
}

export const OffencesList = ({ offences, setDetailedOffence }: OffencesListProps) => {
  return (
    <Table
      head={
        <Table.Row>
          <Table.CellHeader>{"Offence number"}</Table.CellHeader>
          <Table.CellHeader>{"Date"}</Table.CellHeader>
          <Table.CellHeader>{"Code"}</Table.CellHeader>
          <Table.CellHeader>{"Title"}</Table.CellHeader>
        </Table.Row>
      }
    >
      {offences.length > 0 &&
        offences.map((offence, index) => (
          <OffencesListRow
            key={getOffenceCode(offence)}
            offence={offence}
            number={index + 1}
            onClick={setDetailedOffence}
          />
        ))}
    </Table>
  )
}
