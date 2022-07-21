import { Button, Select } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"

const queryParamToFilterState = (value: string) =>
  (value === "triggers" || value === "exceptions" ? value : undefined) as Filter

const ResultFilter = (props: { initialSelection: Filter }) => {
  return (
    <form method={"get"}>
      <Select
        label={"Filter cases"}
        input={{
          id: "result-filter-select",
          name: "resultFilter",
          defaultValue: props.initialSelection,
          className: "form-control"
        }}
      >
        <option value={""}>{"Show all cases"}</option>
        <option value={"triggers"}>{"Show only cases with triggers"}</option>
        <option value={"exceptions"}>{"Show only cases with exceptions"}</option>
      </Select>
      <Button type={"submit"} id={"result-filter-button"}>
        {"Filter"}
      </Button>
    </form>
  )
}

export { ResultFilter, queryParamToFilterState }
