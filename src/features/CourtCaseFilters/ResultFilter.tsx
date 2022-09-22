import { Button, Select, LabelText } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"

const queryParamToFilterState = (value: string) =>
  (value === "triggers" || value === "exceptions" ? value : undefined) as Filter

const ResultFilter = (props: { initialSelection: Filter }) => {
  return (
    <>
      <label htmlFor={"result-filter-select"}>
        <LabelText hidden={true}>{"Filter cases"}</LabelText>
      </label>
      <Select
        label={""}
        input={{
          id: "result-filter-select",
          name: "resultFilter",
          defaultValue: props.initialSelection,
          className: "form-control",
          style: {
            width: "100%"
          }
        }}
      >
        <option value={"all"}>{"Show all"}</option>
        <option value={"triggers"}>{"Show only cases with triggers"}</option>
        <option value={"exceptions"}>{"Show only cases with exceptions"}</option>
      </Select>
      <Button type={"submit"} id={"result-filter-button"}>
        {"Filter"}
      </Button>
    </>
  )
}

export { ResultFilter, queryParamToFilterState }
