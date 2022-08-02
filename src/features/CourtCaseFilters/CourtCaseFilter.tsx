import { GridCol, GridRow } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"
import DefendantNameFilter from "./DefendantNameFilter"
import { ResultFilter } from "./ResultFilter"

interface Props {
  defendantName?: string
  resultFilter: Filter
}

const CourtCaseFilter = (props: Props) => {
  return (
    <form method={"get"}>
      <GridRow>
        <GridCol setWidth={"one-half"} style={{ display: "flex" }}>
          <DefendantNameFilter defendantName={props.defendantName} />
        </GridCol>
        <GridCol setWidth={"one-half"} style={{ display: "flex" }}>
          <ResultFilter initialSelection={props.resultFilter} />
        </GridCol>
      </GridRow>
      <GridRow></GridRow>
    </form>
  )
}

export default CourtCaseFilter
