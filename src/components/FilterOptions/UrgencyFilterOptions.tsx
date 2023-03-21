import RadioButton from "components/RadioButton/RadioButton"
import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"
import type { KeyValuePair } from "types/KeyValuePair"

interface Props {
  urgency?: boolean
  dispatch: Dispatch<FilterAction>
}

const UrgencyOptions: KeyValuePair<string, boolean> = {
  Urgent: true,
  "Non-urgent": false
}

const UrgencyFilterOptions: React.FC<Props> = ({ urgency, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {Object.keys(UrgencyOptions).map((optionName) => (
          <RadioButton
            name={"urgency"}
            key={optionName.toLowerCase()}
            id={optionName.toLowerCase()}
            checked={urgency === UrgencyOptions[optionName]}
            value={optionName}
            label={optionName + " cases only"}
            onChange={(event) => {
              const filterValue = UrgencyOptions[event.target.value]
              dispatch({ method: "add", type: "urgency", value: filterValue })
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default UrgencyFilterOptions
