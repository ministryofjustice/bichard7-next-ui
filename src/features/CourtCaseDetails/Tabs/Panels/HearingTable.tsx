import { Hearing } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import courtTypes from "@moj-bichard7-developers/bichard7-next-data/dist/data/court-type.json"
import { formatDisplayedDate } from "utils/formattedDate"
import { TableRow } from "./TableRow"

interface HearingTableProps {
  hearing: Hearing
}

export const HearingTable = ({ hearing }: HearingTableProps) => {
  const getLanguage = (language: string) => {
    switch (language) {
      case "E":
        return `English(${language})`
      case "W":
        return `Welsh (${language})`
      case "D":
        return `Don't know (${language})`
      default:
        return language
    }
  }

  const getCourtType = (courtCode: string | null | undefined) => {
    let courtTypeWithDescription = courtCode
    courtTypes.forEach((type) => {
      if (type.cjsCode === courtCode) {
        courtTypeWithDescription = `${courtCode} (${type.description})`
      }
    })
    return courtTypeWithDescription
  }

  return (
    <Table>
      <TableRow header="Court location" value={hearing.CourtHearingLocation.OrganisationUnitCode} />
      <TableRow header="Date of hearing" value={formatDisplayedDate(hearing.DateOfHearing)} />
      <TableRow header="Time of hearing" value={hearing.TimeOfHearing} />
      <TableRow header="Defendant present" value={hearing.DefendantPresentAtHearing} />
      <TableRow header="Source reference document name" value={hearing.SourceReference.DocumentName} />
      <TableRow header="Source reference identification" value={hearing.SourceReference.UniqueID} />
      <TableRow header="Source reference document type" value={hearing.SourceReference.DocumentType} />
      <TableRow header="Court type" value={getCourtType(hearing.CourtType)} />
      <TableRow header="LJA code" value={hearing.CourtHouseCode.toString()} />
      <TableRow header="Court name" value={hearing.CourtHouseName} />
      <TableRow header="Hearing language" value={getLanguage(hearing.HearingLanguage)} />
      <TableRow header="Documentation language" value={getLanguage(hearing.HearingDocumentationLanguage)} />
    </Table>
  )
}
