interface Props {
  dateType: string
}

const DateInput: React.FC<Props> = ({ dateType }: Props) => {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset" role="group" aria-describedby="passport-issued-hint">
        <div id="passport-issued-hint" className="govuk-hint">
          {dateType}
        </div>
        <div className="govuk-date-input" id="passport-issued">
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor={`${dateType}Day`}>
                {"Day"}
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-2"
                id={`${dateType}Day`}
                name={`${dateType}Day`}
                type="text"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor={`${dateType}Month`}>
                {"Month"}
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-2"
                id={`${dateType}Month`}
                name={`${dateType}Month`}
                type="text"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor={`${dateType}Year`}>
                {"Year"}
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-4"
                id={`${dateType}Year`}
                name={`${dateType}Year`}
                type="text"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

export default DateInput
