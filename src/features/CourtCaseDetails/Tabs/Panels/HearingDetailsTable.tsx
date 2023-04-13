import { Hearing } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { format } from "date-fns"
import { Table } from "govuk-react"

interface HearingDetailsTableProps {
  hearing: Hearing
}

interface HearingDetailsTableRowProps {
  header: string
  value: string | null | undefined
}

const HearingDetailsTableRow = ({ header, value }: HearingDetailsTableRowProps) => (
  <Table.Row>
    <Table.Cell>
      <b>{header}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)

export const HearingDetailsTable = ({ hearing }: HearingDetailsTableProps) => {
  const getFormatedDateOfHearing = (dateOfHearing: Date | string) =>
    dateOfHearing instanceof Date
      ? format(dateOfHearing, "dd/MM/yyyy").toString()
      : format(new Date(dateOfHearing), "dd/MM/yyyy").toString() ?? ""

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

  const getCourtType = (courtType: string | null | undefined) => {
    switch (courtType) {
      case "CC":
        return `${courtType} (Crown Court)`
      case "COA":
        return `${courtType} (Court of Appeal)`
      case "HC":
        return `${courtType} (High Court)`
      case "MCA":
        return `${courtType} (MC adult)`
      case "MCE":
        return `${courtType} (MC enforcement)`
      case "MCF":
        return `${courtType} (MC family)`
      case "MCL":
        return `${courtType} (MC licensing)`
      case "MCY":
        return `${courtType} (MC youth)`
      default:
        return courtType
    }
  }

  return (
    <Table>
      <HearingDetailsTableRow header="Court location" value={hearing.CourtHearingLocation.OrganisationUnitCode} />
      <HearingDetailsTableRow header="Date of hearing" value={getFormatedDateOfHearing(hearing.DateOfHearing)} />
      <HearingDetailsTableRow header="Time of hearing" value={hearing.TimeOfHearing} />
      <HearingDetailsTableRow header="Defendant present" value={hearing.DefendantPresentAtHearing} />
      <HearingDetailsTableRow header="Source reference document name" value={hearing.SourceReference.DocumentName} />
      <HearingDetailsTableRow header="Source reference identification" value={hearing.SourceReference.UniqueID} />
      <HearingDetailsTableRow header="Source reference document type" value={hearing.SourceReference.DocumentType} />
      <HearingDetailsTableRow header="Court type" value={getCourtType(hearing.CourtType)} />
      <HearingDetailsTableRow header="LJA code" value={hearing.CourtHouseCode.toString()} />
      <HearingDetailsTableRow header="Court name" value={hearing.CourtHouseName} />
      <HearingDetailsTableRow header="Hearing language" value={getLanguage(hearing.HearingLanguage)} />
      <HearingDetailsTableRow
        header="Documentation language"
        value={getLanguage(hearing.HearingDocumentationLanguage)}
      />
    </Table>
  )
}
