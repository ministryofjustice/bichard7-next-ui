import RadioButton from "components/RadioButton/RadioButton"

interface Props {
  urgency?: string | null
}

const UrgencyOptions = ["Urgent", "Non-urgent"]

const UrgencyFilterOptions: React.FC<Props> = ({ urgency }: Props) => (
  <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
    {UrgencyOptions.map((urgencyFilter) => (
      <RadioButton
        name={"urgency"}
        key={urgencyFilter.toLowerCase()}
        id={urgencyFilter.toLowerCase()}
        defaultChecked={urgency === urgencyFilter}
        value={urgencyFilter}
        label={urgencyFilter + " cases only"}
      />
    ))}
  </div>
)

export default UrgencyFilterOptions
