import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { Link, Table } from "govuk-react"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const CourtCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const { basePath, query } = useRouter()

  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`

  return (
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
}
