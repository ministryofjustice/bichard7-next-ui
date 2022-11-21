import RadioButton from "components/RadioButton/RadioButton"
import { HintText } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"

interface Props {
  courtCaseTypes?: Filter[]
  dateRange?: string | null
  urgency?: string | null
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, dateRange, urgency }: Props) => {
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
                    defaultChecked={courtCaseTypes && courtCaseTypes.includes("Exceptions")}
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
                    defaultChecked={courtCaseTypes && courtCaseTypes.includes("Triggers")}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="triggers-type">
                    {"Triggers"}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="govuk-form-group">
            <CourtDateFilterOptions dateRange={dateRange} />
          </div>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Urgency"}</legend>
              <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                {["Urgent", "Non-urgent"].map((urgencyFilter) => (
                  <RadioButton
                    name={"urgency"}
                    key={urgencyFilter.toLowerCase().replace(" ", "-")}
                    id={urgencyFilter.toLowerCase().replace(" ", "-")}
                    defaultChecked={urgency === urgencyFilter}
                    value={urgencyFilter}
                    label={urgencyFilter}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
