import { Button, Select } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"

const queryParamToFilterState = (value: string) =>
  (value === "triggers" || value === "exceptions" ? value : undefined) as Filter

const CourtCaseFilter = (props: { initialSelection: Filter }) => {
  return (
    <form method={"get"}>
      <Select
        label={"Filter cases"}
        input={{
          id: "case-filter-select",
          name: "filter",
          defaultValue: props.initialSelection,
          className: "form-control"
        }}
      >
        <option value={""}>{"Show all cases"}</option>
        <option value={"triggers"}>{"Show only cases with triggers"}</option>
        <option value={"exceptions"}>{"Show only cases with exceptions"}</option>
      </Select>
      <Button type={"submit"} id={"case-filter-button"}>
        {"Filter"}
      </Button>
    </form>
  )
}

export { CourtCaseFilter, queryParamToFilterState }
