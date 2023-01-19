import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import { Paragraph, Table, Link } from "govuk-react"
import DateTime from "components/DateTime"
import type { QueryOrder } from "types/CaseListQueryParams"
import UrgentTag from "./tags/UrgentTag"
import NotesTag from "./tags/NotesTag"

interface Props {
  courtCases: CourtCase[]
  order?: QueryOrder
}

const CourtCaseList: React.FC<Props> = ({ courtCases, order = "asc" }: Props) => {
  const { basePath, query } = useRouter()

  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`

  const caseDetailsPath = (id: number) => `${basePath}/court-cases/${id}`

  const tableHead = (
    <Table.Row>
      <Table.CellHeader>
        <Link href={orderByParams("defendantName")} id="defendant-name">
          {"Defendant Name"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("courtDate")} id="court-date">
          {"Court Date"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("courtName")} id="court-name">
          {"Court Name"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("ptiurn")} id="ptiurn">
          {"PTIURN"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("isUrgent")} id="is-urgent-sort">
          {"Urgent"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>{"Notes"}</Table.CellHeader>
      <Table.CellHeader>{"Triggers"}</Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("errorReason")} id="exceptions">
          {"Exceptions"}
        </Link>
      </Table.CellHeader>
    </Table.Row>
  )
  const tableBody = courtCases.map(
    ({ courtDate, ptiurn, defendantName, courtName, triggers, errorReason, isUrgent, notes }, idx) => {
      return (
        <Table.Row key={idx}>
          <Table.Cell>
            <Link href={caseDetailsPath(courtCases[idx].errorId)} id={`Case details for ${defendantName}`}>
              {defendantName}
            </Link>
          </Table.Cell>
          <Table.Cell>
            <DateTime date={courtDate} dateFormat={"dd/MM/yyyy"} />
          </Table.Cell>
          <Table.Cell>{courtName}</Table.Cell>
          <Table.Cell>{ptiurn}</Table.Cell>
          <Table.Cell>
            <UrgentTag isUrgent={isUrgent} />
          </Table.Cell>
          <Table.Cell>
            <NotesTag notes={notes} />
          </Table.Cell>
          <Table.Cell>{triggers?.map((trigger) => trigger.triggerCode).join(", ")}</Table.Cell>
          <Table.Cell>{errorReason}</Table.Cell>
        </Table.Row>
      )
    }
  )

  if (courtCases.length === 0) {
    return <Paragraph>{"There are no court cases to show"}</Paragraph>
  }

  return <Table head={tableHead}>{tableBody}</Table>
}

export default CourtCaseList
