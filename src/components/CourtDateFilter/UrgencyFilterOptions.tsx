import RadioButton from "components/RadioButton/RadioButton"
import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  urgency?: string | null
  dispatch: Dispatch<FilterAction>
}

const UrgencyOptions = ["Urgent", "Non-urgent"]

const UrgencyFilterOptions: React.FC<Props> = ({ urgency, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Urgency"}</legend>
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {UrgencyOptions.map((urgencyFilter) => (
          <RadioButton
            name={"urgency"}
            key={urgencyFilter.toLowerCase()}
            id={urgencyFilter.toLowerCase()}
            defaultChecked={urgency === urgencyFilter}
            value={urgencyFilter}
            label={urgencyFilter + " cases only"}
            onClick={(option: string) => {
              const filterValue = option === "Urgent"
              dispatch({ method: "add", type: "urgency", value: filterValue })
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default UrgencyFilterOptions
