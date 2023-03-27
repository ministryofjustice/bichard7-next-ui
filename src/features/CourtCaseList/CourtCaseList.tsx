import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { Link, Paragraph, Table } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import type { QueryOrder } from "types/CaseListQueryParams"
import CourtCaseListEntry from "./CourtCaseListEntry"

interface Props {
  courtCases: CourtCase[]
  order?: QueryOrder
  currentUser: User
}

const CourtCaseList: React.FC<Props> = ({ courtCases, order = "asc", currentUser }: Props) => {
  const { basePath, query } = useRouter()

  const recentlyUnlockedExceptionId = query.unlockException
  const recentlyUnlockedTriggerId = query.unlockTrigger

  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`
  const tableHead = (
    <Table.Row>
      <Table.Cell></Table.Cell>
      <Table.CellHeader setWidth={"178px"}>
        <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("defendantName")} id="defendant-name-sort">
            {"Defendant Name"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth={"115px"}>
        <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("courtDate")} id="court-date-sort">
            {"Court Date"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader>
        <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("courtName")} id="court-name-sort">
            {"Court Name"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader>
        <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("ptiurn")} id="ptiurn-sort">
            {"PTIURN"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader>
        <ColumnOrderIcons columnName={"isUrgent"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("isUrgent")} id="is-urgent-sort">
            {"Urgent"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader>
        <ColumnOrderIcons columnName={"notes"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("notes")} id="notes-sort">
            {"Notes"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader>{"Reason"}</Table.CellHeader>
      <Table.CellHeader>
        <ColumnOrderIcons columnName={"lockedBy"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("lockedBy")} id="locked-by-sort">
            {"Locked By"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
    </Table.Row>
  )

  if (courtCases.length === 0) {
    return <Paragraph>{"There are no court cases to show"}</Paragraph>
  }

  return (
    <Table head={tableHead}>
      {courtCases.map((courtCase) => (
        <CourtCaseListEntry
          courtCase={courtCase}
          currentUser={currentUser}
          exceptionHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedExceptionId}
          triggerHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedTriggerId}
          key={`court-case-${courtCase.ptiurn}`}
        />
      ))}
    </Table>
  )
}

export default CourtCaseList
