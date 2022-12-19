import RadioButton from "components/RadioButton/RadioButton"
import type { ChangeEvent, Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"
import lockedFilters from "utils/lockedFilters"

interface Props {
  locked?: string | null
  dispatch: Dispatch<FilterAction>
}

const LockedFilterOptions: React.FC<Props> = ({ locked, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Locked state"}</legend>
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {lockedFilters.map((lockedFilter) => (
          <RadioButton
            name={"locked"}
            key={lockedFilter.toLowerCase()}
            id={lockedFilter.toLowerCase()}
            checked={locked === lockedFilter}
            value={lockedFilter}
            label={lockedFilter + " cases only"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({ method: "add", type: "locked", value: event.target.value })
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default LockedFilterOptions
