import RadioButton from "components/RadioButton/RadioButton"
import lockedFilters from "utils/lockedFilters"

interface Props {
  locked?: string | null
}

const LockedFilterOptions: React.FC<Props> = ({ locked }: Props) => (
  <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
    {lockedFilters.map((lockedFilter) => (
      <RadioButton
        name={"locked"}
        key={lockedFilter.toLowerCase()}
        id={lockedFilter.toLowerCase()}
        defaultChecked={locked === lockedFilter}
        value={lockedFilter}
        label={lockedFilter + " cases only"}
      />
    ))}
  </div>
)

export default LockedFilterOptions
