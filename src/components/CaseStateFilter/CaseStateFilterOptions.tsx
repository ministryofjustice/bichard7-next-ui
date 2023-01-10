import RadioButton from "components/RadioButton/RadioButton"
import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"
import caseStateFilters, { caseStateLabels } from "utils/caseStateFilters"
import { parameterizeString } from "utils/validators/stringFormatUtils"

interface Props {
  state?: string
  dispatch: Dispatch<FilterAction>
}

const CaseStateFilterOptions: React.FC<Props> = ({}: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Case state"}</legend>
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {caseStateFilters.map((optionName) => (
          <RadioButton
            name={"state"}
            key={parameterizeString(optionName)}
            id={parameterizeString(optionName)}
            value={optionName}
            label={caseStateLabels[optionName]}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default CaseStateFilterOptions
