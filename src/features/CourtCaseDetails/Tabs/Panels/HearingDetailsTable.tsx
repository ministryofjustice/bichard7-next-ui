import { Hearing } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { format } from "date-fns"
import { Table } from "govuk-react"

interface HearingDetailsTableProps {
  hearing: Hearing
}

export const HearingDetailsTable = ({ hearing }: HearingDetailsTableProps) => {
  const dateOfHearing =
    hearing.DateOfHearing instanceof Date
      ? format(hearing.DateOfHearing, "dd/MM/yyyy").toString()
      : format(new Date(hearing?.DateOfHearing), "dd/MM/yyyy").toString() ?? ""

  const getLanguage = (language: string) => (language === "D" ? "D (Don't know)" : language)

  return (
    <Table>
      <Table.Row>
        <Table.Cell>
          <b>{"Court location"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.CourtHearingLocation.OrganisationUnitCode}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Date of hearing"}</b>
        </Table.Cell>
        <Table.Cell>{dateOfHearing}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Time of hearing"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.TimeOfHearing}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Defendant present"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.DefendantPresentAtHearing}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Source reference doc name"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.SourceReference.DocumentName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Source reference identification"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.SourceReference.UniqueID}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Source reference document type"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.SourceReference.DocumentType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Court type"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.CourtType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"LJA code"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.CourtHouseCode}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Court name"}</b>
        </Table.Cell>
        <Table.Cell>{hearing.CourtHouseName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Hearing language"}</b>
        </Table.Cell>
        <Table.Cell>{getLanguage(hearing.HearingLanguage)}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <b>{"Documentation language"}</b>
        </Table.Cell>
        <Table.Cell>{getLanguage(hearing.HearingDocumentationLanguage)}</Table.Cell>
      </Table.Row>
    </Table>
  )
}
