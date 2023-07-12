import RadioButton from "components/RadioButton/RadioButton"
import type { ChangeEvent, Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"
import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import lockedFilters from "utils/lockedFilters"

interface Props {
  locked?: boolean
  dispatch: Dispatch<FilterAction>
}

const LockedOptions: KeyValuePair<string, boolean> = {
  Locked: true,
  Unlocked: false
}

const LockedFilterOptions: React.FC<Props> = ({ locked, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {lockedFilters.map((optionName) => (
          <RadioButton
            name={"locked"}
            key={optionName.toLowerCase()}
            id={optionName.toLowerCase()}
            checked={locked === LockedOptions[optionName]}
            value={optionName}
            label={optionName + " cases only"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({ method: "add", type: "locked", value: LockedOptions[event.target.value] })
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default LockedFilterOptions
