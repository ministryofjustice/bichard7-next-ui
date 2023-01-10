import RadioButton from "components/RadioButton/RadioButton"
import type { Dispatch } from "react"
import { CaseState } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"
import caseStateFilters, { caseStateLabels } from "utils/caseStateFilters"
import { parameterizeString } from "utils/validators/stringFormatUtils"

interface Props {
  state?: string
  dispatch: Dispatch<FilterAction>
}

const CaseStateFilterOptions: React.FC<Props> = ({ state, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Case state"}</legend>
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {caseStateFilters.map((optionName) => (
          <RadioButton
            name={"state"}
            key={parameterizeString(optionName)}
            id={parameterizeString(optionName)}
            checked={state === optionName}
            value={optionName}
            label={caseStateLabels[optionName]}
            onChange={(event) => {
              const filterValue = event.target.value as CaseState
              dispatch({ method: "add", type: "caseState", value: filterValue })
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default CaseStateFilterOptions
