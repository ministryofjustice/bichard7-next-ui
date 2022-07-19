import { Button, GridCol, GridRow, Link, Select } from "govuk-react"
import { useState } from "react"
import { Filter } from "types/CaseListQueryParams"

const queryParamToFilterState = (value: string) =>
  (value === "triggers" || value === "exceptions" ? value : undefined) as Filter

const CourtCaseFilter = (props: { initialSelection: Filter }) => {
  const [currentSelection, setCurrentSelection] = useState(props.initialSelection)

  return (
    <GridRow>
      <GridCol>
        <Select
          label={"Filter cases"}
          input={{
            value: currentSelection,
            onChange: (e) => setCurrentSelection(queryParamToFilterState(e.target.value))
          }}
        >
          <option value={""} selected={!currentSelection}>
            {"Show all cases"}
          </option>
          <option value={"triggers"} selected={currentSelection === "triggers"}>
            {"Show only cases with triggers"}
          </option>
          <option value={"exceptions"} selected={currentSelection === "exceptions"}>
            {"Show only cases with exceptions"}
          </option>
        </Select>
      </GridCol>
      <GridCol>
        <Link href={`/bichard?filter=${currentSelection}`}>
          <Button>{"Filter"}</Button>
        </Link>
      </GridCol>
    </GridRow>
  )
}

export { CourtCaseFilter, queryParamToFilterState }
