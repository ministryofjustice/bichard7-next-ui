import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Heading, Table } from "govuk-react"

import getOffenceCode from "utils/getOffenceCode"
import { OffencesListRow } from "./OffencesListRow"

interface OffencesListProps {
  className: string
  offences: Offence[]
  setDetailedOffenceIndex: (index: number) => void
}

export const OffencesList = ({ className, offences, setDetailedOffenceIndex }: OffencesListProps) => {
  return (
    <div className={className}>
      <Heading as="h3" size="MEDIUM">
        {"Offences"}
      </Heading>
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
              onClick={() => setDetailedOffenceIndex(index + 1)}
            />
          ))}
      </Table>
    </div>
  )
}
