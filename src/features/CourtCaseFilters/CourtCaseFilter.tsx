/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { HintText } from "govuk-react"
import { useState } from "react"
import { Reason } from "types/CaseListQueryParams"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"

interface Props {
  courtCaseTypes?: Reason[]
  dateRange?: string | null
  urgency?: string | null
  locked?: string | null
}
const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, dateRange, urgency, locked }: Props) => {
  const [isVisible, setVisible] = useState(false)
  const [isLabel, setLabel] = useState("")
  console.log(isLabel)

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
              <h2 className="govuk-heading-m govuk-!-margin-bottom-0">{"Selected filters"}</h2>
              <ul className="moj-filter-tags">
                <li>
                  <a className={isVisible ? "moj-filter__tag" : "moj-filter moj-hidden"} href="#">
                    <span className="govuk-visually-hidden">{"Remove this filter"}</span>
                    {isLabel}
                  </a>
                </li>
              </ul>
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
            <CourtCaseTypeOptions courtCaseTypes={courtCaseTypes} />
          </div>
          <div className="govuk-form-group">
            <CourtDateFilterOptions dateRange={dateRange} />
          </div>
          <div>
            <UrgencyFilterOptions
              urgency={urgency}
              onClick={() => {
                setVisible(!isVisible)
              }}
              setLabel={setLabel}
            />
          </div>
          <div>
            <LockedFilterOptions locked={locked} />
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
