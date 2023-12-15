import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { Link, Table } from "govuk-react"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"

import ColumnHeading from "features/CourtCaseFilters/ColumnHeading"
import { useCustomStyles } from "../../../styles/customStyles"
import styled from "styled-components"

const CellHeader = styled(Table.CellHeader)`
  border-color: var(--border-input);
`

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const CourtCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const { basePath, query } = useRouter()
  const classes = useCustomStyles()

  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`

  return (
    <Table.Row>
      <CellHeader />
      <CellHeader className={classes["table-column-header-cell"]} setWidth={"178px"}>
        <Link
          className={classes["table-column-header-link"]}
          href={orderByParams("defendantName")}
          id="defendant-name-sort"
        >
          {"Defendant name"}
          <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
      <CellHeader className={classes["table-column-header-cell"]} setWidth={"115px"}>
        <Link className={classes["table-column-header-link"]} href={orderByParams("courtDate")} id="court-date-sort">
          {"Court date"}
          <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
      <CellHeader className={classes["table-column-header-cell"]}>
        <Link className={classes["table-column-header-link"]} href={orderByParams("courtName")} id="court-name-sort">
          {"Court name"}
          <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
      <CellHeader className={classes["table-column-header-cell"]}>
        <Link className={classes["table-column-header-link"]} href={orderByParams("ptiurn")} id="ptiurn-sort">
          {"PTIURN"}
          <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
      <CellHeader className={classes["table-column-header-cell"]}>
        <Link className={classes["table-column-header-link"]} href={orderByParams("isUrgent")} id="is-urgent-sort">
          {"Urgent"}
          <ColumnOrderIcons columnName={"isUrgent"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
      <CellHeader className={classes["table-column-header-cell"]}>
        <Link className={classes["table-column-header-link"]} href={orderByParams("notes")} id="notes-sort">
          {"Notes"}
          <ColumnOrderIcons columnName={"notes"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
      <CellHeader className={classes["table-column-header-cell"]}>
        <ColumnHeading>{"Reason"}</ColumnHeading>
      </CellHeader>
      <CellHeader>
        <Link className={classes["table-column-header-link"]} href={orderByParams("lockedBy")} id="locked-by-sort">
          {"Locked by"}
          <ColumnOrderIcons columnName={"lockedBy"} currentOrder={query.order} orderBy={query.orderBy} />
        </Link>
      </CellHeader>
    </Table.Row>
  )
}
