import { GridCol, GridRow } from "govuk-react"
import { createUseStyles } from "react-jss"
import { Filter } from "types/CaseListQueryParams"
import DefendantNameFilter from "./DefendantNameFilter"
import { ResultFilter } from "./ResultFilter"

const useStyles = createUseStyles({
  flex: {
    display: "flex"
  }
})

interface Props {
  defendantName?: string
  resultFilter: Filter
}

const CourtCaseFilter = (props: Props) => {
  const classes = useStyles()
  return (
    <form method={"get"}>
      <GridRow>
        <GridCol setWidth={"one-half"} className={classes.flex}>
          <DefendantNameFilter defendantName={props.defendantName} />
        </GridCol>
        <GridCol setWidth={"one-half"} className={classes.flex}>
          <ResultFilter initialSelection={props.resultFilter} />
        </GridCol>
      </GridRow>
      <GridRow></GridRow>
    </form>
  )
}

export default CourtCaseFilter
