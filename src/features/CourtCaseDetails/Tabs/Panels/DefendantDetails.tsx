import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { Table } from "govuk-react"
import { capitalizeString } from "utils/capitaliseString"
import { formatDisplayedDate } from "utils/formattedDate"
import { AddressCell } from "./AddressCell"
import { TableRow } from "./TableRow"

interface DefendantDetailsProps {
  defendant: HearingDefendant
  asn: string | null
}
export const DefendantDetails = ({ defendant, asn }: DefendantDetailsProps) => {
  console.log("defendant tab", asn)
  return (
    <Table>
      <TableRow className="asn" label="ASN" value={asn} />
      <TableRow label="PNC Check name" value={defendant.PNCCheckname} />
      <TableRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
      <TableRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
      <TableRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
      <TableRow label="Date of birth" value={formatDisplayedDate(defendant.DefendantDetail?.BirthDate || "")} />
      <TableRow
        label="Gender"
        value={`${defendant.DefendantDetail?.Gender} (${GenderCodes[defendant.DefendantDetail?.Gender as GenderCode]})`}
      />
      <TableRow label="Address" value={<AddressCell address={defendant.Address} />} />
      <TableRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
      <TableRow
        label="Remand status"
        value={capitalizeString(RemandStatuses[defendant.RemandStatus as RemandStatusCode])}
      />
    </Table>
  )
}
