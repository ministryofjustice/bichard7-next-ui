import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Heading, Table } from "govuk-react"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../TableRow"

interface OffenceDetailsProps {
  offence: Offence
  offencesCount: number
}

export const OffenceDetails = ({ offence, offencesCount }: OffenceDetailsProps) => {
  console.log("offence", offence)
  return (
    <>
      <Heading as="h4" size="MEDIUM">
        {`Offence x of ${offencesCount}`}
      </Heading>
      <Table>
        <TableRow header="Offence code" value={getOffenceCode(offence)} />
        <TableRow header="Title" value={offence.OffenceTitle} />
        <TableRow header="Sequence number" value={"A"} />
        <TableRow header="Category" value={offence.OffenceCategory} />
        <TableRow header="Arrest date" value={offence.ArrestDate?.toString()} />
        <TableRow header="Charge date" value={offence.ChargeDate?.toString()} />
        <TableRow header="Date code" value={offence.ActualOffenceDateCode} />
        <TableRow header="Start date" value={offence.ActualOffenceStartDate?.StartDate.toString()} />
        <TableRow header="Location" value={offence.LocationOfOffence} />
        <TableRow header="Wording" value={offence.ActualOffenceWording} />
        <TableRow header="Record on PNC" value={"A"} />
        <TableRow header="Notifiable to Home Office" value={"A"} />
        <TableRow header="Home Office classification" value={offence.HomeOfficeClassification} />
        <TableRow header="Conviction date" value={offence.ConvictionDate?.toString()} />
        <TableRow header="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow header="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow header="Committed on bail" value={offence.CommittedOnBail} />
      </Table>
    </>
  )
}
