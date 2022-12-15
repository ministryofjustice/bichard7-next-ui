import RadioButton from "components/RadioButton/RadioButton"
import lockedFilters from "utils/lockedFilters"

interface Props {
  locked?: string | null
  onClick: (option: string) => void
}

const LockedFilterOptions: React.FC<Props> = ({ locked, onClick }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Locked state"}</legend>
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {lockedFilters.map((lockedFilter) => (
          <RadioButton
            name={"locked"}
            key={lockedFilter.toLowerCase()}
            id={lockedFilter.toLowerCase()}
            defaultChecked={locked === lockedFilter}
            value={lockedFilter}
            label={lockedFilter + " cases only"}
            onClick={(option: string) => onClick(option)}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default LockedFilterOptions
