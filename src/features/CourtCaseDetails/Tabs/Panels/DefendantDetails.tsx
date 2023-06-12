import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { TableRow } from "./TableRow"
import { formatDisplayedDate } from "utils/formattedDate"
import { AddressCell } from "./AddressCell"

interface DefendantDetailsProps {
  defendant: HearingDefendant
}

const getFormatedDateOfBirth = (dateOfBirth: Date | string) => {
  return dateOfBirth instanceof Date
    ? formatDisplayedDate(dateOfBirth).toString()
    : formatDisplayedDate(new Date(dateOfBirth)).toString() ?? ""
}

const getFormattedGender = (genderCode: number | undefined): string => {
  switch (genderCode) {
    case 0:
      return "0(not known)"
    case 1:
      return "1(male)"
    case 2:
      return "1(female)"
    case 9:
      return "9(not specified)"
    default:
      return ""
  }
}

const getFormattedRemandStatus = (bailCode: string | undefined): string => {
  switch (bailCode) {
    case "CB":
      return "Conditional bail"
    case "LA":
      return "Care"
    case "NA":
      return "Not applicable"
    case "PB":
      return "Custody"
    case "PR":
      return "Custody"
    case "SA":
      return "Secure care"
    case "UB":
      return "Unconditional bail"
    default:
      return ""
  }
}

export const DefendantDetails = ({ defendant }: DefendantDetailsProps) => {
  return (
    <Table>
      <TableRow label="PNC Check name" value={defendant.PNCCheckname} />
      <TableRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
      <TableRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
      <TableRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
      <TableRow label="Date of birth" value={getFormatedDateOfBirth(defendant.DefendantDetail?.BirthDate || "")} />
      <TableRow label="Gender" value={getFormattedGender(defendant.DefendantDetail?.Gender)} />
      <TableRow label="Address" value={<AddressCell address={defendant.Address} />} />
      <TableRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
      <TableRow label="Remand status" value={getFormattedRemandStatus(defendant.RemandStatus)} />
    </Table>
  )
}
