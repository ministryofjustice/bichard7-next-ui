import { HintText } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"

interface Props {
  courtCaseTypes: Filter[]
  urgency: boolean
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, urgency }: Props) => {
  return (
    <form method={"get"}>
      <div className="moj-filter__header">
        <div className="moj-filter__header-title">
          <h2 className="govuk-heading-m">{"Filter"}</h2>
        </div>
        <div className="moj-filter__header-action"></div>
      </div>
      <div className="moj-filter__content">
        <div className="moj-filter__selected">
          <div className="moj-filter__selected-heading">
            <div className="moj-filter__heading-title">
              <h2 className="govuk-heading-m">{"Selected filters"}</h2>
            </div>
          </div>
        </div>
        <div className="moj-filter__options">
          <button className="govuk-button" data-module="govuk-button" id="search">
            {"Apply filters"}
          </button>
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--m" htmlFor="keywords">
              {"Keywords"}
            </label>
            <HintText>{"Defendent name, Court name, Reason, PTIURN"}</HintText>
            <input className="govuk-input" id="keywords" name="keywords" type="text"></input>
          </div>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Case type"}</legend>
              <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="exceptions-type"
                    name="type"
                    type="checkbox"
                    value="Exceptions"
                    defaultChecked={courtCaseTypes.includes("Exceptions")}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="exceptions-type">
                    {"Exceptions"}
                  </label>
                </div>
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="triggers-type"
                    name="type"
                    type="checkbox"
                    value="Triggers"
                    defaultChecked={courtCaseTypes.includes("Triggers")}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="triggers-type">
                    {"Triggers"}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Court Date"}</legend>
              <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="date-range"
                    type="radio"
                    data-aria-controls="conditional-contact"
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor="date-range">
                    {"Date Range"}
                  </label>
                </div>
                <div className="govuk-radios__conditional" id="conditional-contact">
                  <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                    <div className="govuk-radios__item">
                      <input
                        className="govuk-radios__input"
                        id="date-range-today"
                        name="dateRange"
                        type="radio"
                        value="today"
                      />
                      <label className="govuk-label govuk-radios__label" htmlFor="date-range-today">
                        {"Today"}
                      </label>
                    </div>
                    <div className="govuk-radios__item">
                      <input
                        className="govuk-radios__input"
                        id="date-range-yesterday"
                        name="dateRange"
                        type="radio"
                        value="yesterday"
                      />
                      <label className="govuk-label govuk-radios__label" htmlFor="date-range-yesterday">
                        {"Yesterday"}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="custom-date-range"
                    name="courtDate"
                    type="radio"
                    value=""
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor="custom-date-range">
                    {"Custom date range"}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Urgency"}</legend>
              <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="is-urgent-filter"
                    name="urgency"
                    type="checkbox"
                    value="Urgent"
                    defaultChecked={urgency}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="is-urgent-filter">
                    {"Urgent"}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
