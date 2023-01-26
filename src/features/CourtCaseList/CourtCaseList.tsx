import DateTime from "components/DateTime"
import If from "components/If"
import { Link, Paragraph, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import type { QueryOrder } from "types/CaseListQueryParams"
import LockedByTag from "./tags/LockedByTag"
import NotesTag from "./tags/NotesTag"
import UrgentTag from "./tags/UrgentTag"

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
      <Table.Cell></Table.Cell>
      <Table.CellHeader>
        <Link href={orderByParams("defendantName")} id="defendant-name-sort">
          {"Defendant Name"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("courtDate")} id="court-date-sort">
          {"Court Date"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("courtName")} id="court-name-sort">
          {"Court Name"}
        </Link>
      </Table.CellHeader>
      <Table.CellHeader>
        <Link href={orderByParams("ptiurn")} id="ptiurn-sort">
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
      <Table.CellHeader>
        <Link href={orderByParams("errorLockedByUsername")} id="locked-by-sort">
          {"Locked By"}
        </Link>
      </Table.CellHeader>
    </Table.Row>
  )
  const tableBody = courtCases.map(
    (
      { courtDate, ptiurn, defendantName, courtName, triggers, errorReason, isUrgent, notes, errorLockedByUsername },
      idx
    ) => {
      return (
        <Table.Row key={idx}>
          <Table.Cell>
            <If condition={!!errorLockedByUsername}>
              <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
            </If>
          </Table.Cell>
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
          <Table.Cell>
            <LockedByTag lockedBy={errorLockedByUsername} />
          </Table.Cell>
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
