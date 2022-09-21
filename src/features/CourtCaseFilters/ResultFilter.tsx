import { Button, Select } from "govuk-react"
import { createUseStyles } from "react-jss"
import { Filter } from "types/CaseListQueryParams"

const useStyles = createUseStyles({
  filterButton: {
    margin: {
      top: "0.1rem"
    }
  },
  select: {
    select: {
      width: "100%"
    }
  }
})

const queryParamToFilterState = (value: string) =>
  (value === "triggers" || value === "exceptions" ? value : undefined) as Filter

const ResultFilter = (props: { initialSelection: Filter }) => {
  const classes = useStyles()
  return (
    <>
      <Select
        label={""}
        input={{
          id: "result-filter-select",
          name: "resultFilter",
          defaultValue: props.initialSelection,
          className: classes.select
        }}
      >
        <option value={""}>{"Show all cases"}</option>
        <option value={"triggers"}>{"Show only cases with triggers"}</option>
        <option value={"exceptions"}>{"Show only cases with exceptions"}</option>
      </Select>

      <Button type={"submit"} id={"result-filter-button"} className={classes.filterButton}>
        {"Filter"}
      </Button>
    </>
  )
}

export { ResultFilter, queryParamToFilterState }
