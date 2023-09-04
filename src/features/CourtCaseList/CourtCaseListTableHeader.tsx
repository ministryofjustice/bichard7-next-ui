import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { Link, Table } from "govuk-react"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"

import { useCustomStyles } from "../../../styles/customStyles"

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const CourtCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const { basePath, query } = useRouter()
  const classes = useCustomStyles()

  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`

  return (
    <Table.Row>
      <Table.Cell></Table.Cell>
      <Table.CellHeader className={classes["table-column-header-cell"]} setWidth={"178px"}>
        <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link
            className={classes["table-column-header-link"]}
            href={orderByParams("defendantName")}
            id="defendant-name-sort"
          >
            {"Defendant name"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader className={classes["table-column-header-cell"]} setWidth={"115px"}>
        <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link className={classes["table-column-header-link"]} href={orderByParams("courtDate")} id="court-date-sort">
            {"Court date"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader className={classes["table-column-header-cell"]}>
        <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link className={classes["table-column-header-link"]} href={orderByParams("courtName")} id="court-name-sort">
            {"Court name"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader className={classes["table-column-header-cell"]}>
        <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link className={classes["table-column-header-link"]} href={orderByParams("ptiurn")} id="ptiurn-sort">
            {"PTIURN"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader className={classes["table-column-header-cell"]}>
        <ColumnOrderIcons columnName={"isUrgent"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link className={classes["table-column-header-link"]} href={orderByParams("isUrgent")} id="is-urgent-sort">
            {"Urgent"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader className={classes["table-column-header-cell"]}>
        <ColumnOrderIcons columnName={"notes"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link className={classes["table-column-header-link"]} href={orderByParams("notes")} id="notes-sort">
            {"Notes"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader>{"Reason"}</Table.CellHeader>
      <Table.CellHeader>
        <ColumnOrderIcons columnName={"lockedBy"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link className={classes["table-column-header-link"]} href={orderByParams("lockedBy")} id="locked-by-sort">
            {"Locked by"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
    </Table.Row>
  )
}
