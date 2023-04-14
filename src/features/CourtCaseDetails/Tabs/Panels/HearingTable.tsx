import { Hearing } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"

import { Table } from "govuk-react"
import courtTypes from "@moj-bichard7-developers/bichard7-next-data/dist/data/court-type.json"
import { getDisplayDateFromDateOrString } from "utils/formattedDate"

interface HearingTableProps {
  hearing: Hearing
}

interface HearingTableRowProps {
  header: string
  value: string | null | undefined
}

const HearingTableRow = ({ header, value }: HearingTableRowProps) => (
  <Table.Row>
    <Table.Cell>
      <b>{header}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)

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
      <HearingTableRow header="Court location" value={hearing.CourtHearingLocation.OrganisationUnitCode} />
      <HearingTableRow header="Date of hearing" value={getDisplayDateFromDateOrString(hearing.DateOfHearing)} />
      <HearingTableRow header="Time of hearing" value={hearing.TimeOfHearing} />
      <HearingTableRow header="Defendant present" value={hearing.DefendantPresentAtHearing} />
      <HearingTableRow header="Source reference document name" value={hearing.SourceReference.DocumentName} />
      <HearingTableRow header="Source reference identification" value={hearing.SourceReference.UniqueID} />
      <HearingTableRow header="Source reference document type" value={hearing.SourceReference.DocumentType} />
      <HearingTableRow header="Court type" value={getCourtType(hearing.CourtType)} />
      <HearingTableRow header="LJA code" value={hearing.CourtHouseCode.toString()} />
      <HearingTableRow header="Court name" value={hearing.CourtHouseName} />
      <HearingTableRow header="Hearing language" value={getLanguage(hearing.HearingLanguage)} />
      <HearingTableRow header="Documentation language" value={getLanguage(hearing.HearingDocumentationLanguage)} />
    </Table>
  )
}
