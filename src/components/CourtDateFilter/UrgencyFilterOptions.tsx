import RadioButton from "components/RadioButton/RadioButton"

interface Props {
  urgency?: string | null
  onClick: boolean
  setLabel: string
}

const UrgencyOptions = ["Urgent", "Non-urgent"]

const UrgencyFilterOptions: React.FC<Props> = ({ urgency, onClick, setLabel }: Props) => {
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
            onClick={onClick}
            setLabel={setLabel(urgencyFilter)}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default UrgencyFilterOptions
