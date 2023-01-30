const DateInput: React.FC = () => {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset" role="group" aria-describedby="passport-issued-hint">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">{"When was your passport issued?"}</h1>
        </legend>
        <div id="passport-issued-hint" className="govuk-hint">
          {"For example, 27 3 2007"}
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
