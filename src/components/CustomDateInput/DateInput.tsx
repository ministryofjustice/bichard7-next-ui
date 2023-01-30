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
              <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-day">
                {"Day"}
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-2"
                id="passport-issued-day"
                name="passport-issued-day"
                type="text"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-month">
                {"Month"}
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-2"
                id="passport-issued-month"
                name="passport-issued-month"
                type="text"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-year">
                {"Year"}
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-4"
                id="passport-issued-year"
                name="passport-issued-year"
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
