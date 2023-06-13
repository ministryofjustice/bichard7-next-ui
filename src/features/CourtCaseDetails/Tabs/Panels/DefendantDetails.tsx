import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { TableRow } from "./TableRow"
import { formatDisplayedDate } from "utils/formattedDate"
import { AddressCell } from "./AddressCell"

interface DefendantDetailsProps {
  defendant: HearingDefendant
}

export enum Gender {
  "0(not known)" = 0,
  "1(male)" = 1,
  "2(female)" = 2,
  "9(not specified)" = 9
}

export type RemandCode = "CB" | "LA" | "NA" | "PB" | "PR" | "SA" | "UB"

export enum RemandStatus {
  CB = "Conditional bail",
  LA = "Care",
  NA = "Not applicable",
  PB = "Custody",
  PR = "Custody",
  SA = "Secure care",
  UB = "Unconditional bail"
}

const getFormatedDateOfBirth = (dateOfBirth: Date | string) => {
  return dateOfBirth instanceof Date
    ? formatDisplayedDate(dateOfBirth).toString()
    : formatDisplayedDate(new Date(dateOfBirth)).toString() ?? ""
}

export const DefendantDetails = ({ defendant }: DefendantDetailsProps) => {
  const defendantGender = defendant.DefendantDetail ? Gender[defendant.DefendantDetail?.Gender] : ""

  return (
    <Table>
      <TableRow label="PNC Check name" value={defendant.PNCCheckname} />
      <TableRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
      <TableRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
      <TableRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
      <TableRow label="Date of birth" value={getFormatedDateOfBirth(defendant.DefendantDetail?.BirthDate ?? "")} />
      <TableRow label="Gender" value={defendantGender} />
      <TableRow label="Address" value={<AddressCell address={defendant.Address} />} />
      <TableRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
      <TableRow label="Remand status" value={RemandStatus[defendant.RemandStatus as RemandCode]} />
    </Table>
  )
}
