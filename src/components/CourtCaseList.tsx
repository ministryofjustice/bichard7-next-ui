import CourtCase from "entities/CourtCase"
import { Paragraph, Table, Link } from "govuk-react"
import DateTime from "../components/DateTime"

interface Props {
  courtCases: CourtCase[]
  order?: "ASC" | "DESC" | undefined
}

const orderByParams = (orderBy: string, order: string) => `/bichard/?orderBy=${orderBy}&order=${order}`

const CourtCaseList: React.FC<Props> = ({ courtCases, order = "ASC" }: Props) => {
  const tableHead = (
    <Table.Row>
      <Table.CellHeader>
        <Link href={orderByParams("courtDate", order)} id="court-date">
          {"Court Date"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("ptiurn", order)} id="ptiurn">
          {"PTIURN"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("defendantName", order)} id="defendant-name">
          {"Defendant Name"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("courtName", order)} id="court-name">
          {"Court Name"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>{"Triggers"}</Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("errorReason", order)} id="exceptions">
          {"Exceptions"}
        </Link>
      </Table.CellHeader>
    </Table.Row>
  )
  const tableBody = courtCases.map((courtCase, idx) => {
    return (
      <Table.Row key={idx}>
        <Table.Cell>
          <DateTime date={courtCase.courtDate} />
        </Table.Cell>
        <Table.Cell>{courtCase.ptiurn}</Table.Cell>
        <Table.Cell>{courtCase.defendantName}</Table.Cell>
        <Table.Cell>{courtCase.courtName}</Table.Cell>
        <Table.Cell>{courtCase.triggers?.map((trigger) => trigger.triggerCode).join(", ")}</Table.Cell>
        <Table.Cell>{courtCase.errorReason}</Table.Cell>
      </Table.Row>
    )
  })

  if (courtCases.length === 0) {
    return <Paragraph>{"There are no court cases to show"}</Paragraph>
  }

  return <Table head={tableHead}>{tableBody}</Table>
}

export default CourtCaseList
