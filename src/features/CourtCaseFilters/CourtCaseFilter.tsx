import { GridCol, GridRow } from "govuk-react"
import { createUseStyles } from "react-jss"
import { Filter } from "types/CaseListQueryParams"
import DefendantNameFilter from "./DefendantNameFilter"
import { ResultFilter } from "./ResultFilter"
import UrgentFilter from "./UrgentFilter"

const useStyles = createUseStyles({
  flex: {
    display: "flex"
  }
})

interface Props {
  defendantName?: string
  resultFilter: Filter
  urgentFilter: boolean
}

const CourtCaseFilter = (props: Props) => {
  const classes = useStyles()
  return (
    <form method={"get"}>
      <GridRow>
        <GridCol setWidth={"one-third"} className={classes.flex}>
          <DefendantNameFilter defendantName={props.defendantName} />
        </GridCol>
        <GridCol setWidth={"one-third"} className={classes.flex}>
          <ResultFilter initialSelection={props.resultFilter} />
        </GridCol>
        <GridCol setWidth={"one-third"} className={classes.flex}>
          <UrgentFilter checked={props.urgentFilter} />
        </GridCol>
      </GridRow>
      <GridRow></GridRow>
    </form>
  )
}

export default CourtCaseFilter
