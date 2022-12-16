import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import FilterChip from "components/FilterChip"
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
  const urgentFilterState = {
    filter: useState<boolean | undefined>(undefined),
    label: useState<string>("")
  }
  const dateFilterState = {
    filter: useState<string | undefined>(undefined),
    label: useState<string>("")
  }
  const lockedFilterState = {
    filter: useState<boolean | undefined>(undefined),
    label: useState<string>("")
  }
  const reasonFilterState = {
    filter: useState<string[]>([]),
    label: useState<string>("")
  }

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
                  <FilterChip
                    tag={urgentFilterState.filter[0] !== undefined ? "moj-filter__tag" : "moj-filter moj-hidden"}
                    chipLabel={urgentFilterState.label[0]}
                    paramName="urgency"
                  />
                  <FilterChip
                    tag={dateFilterState.filter[0] !== undefined ? "moj-filter__tag" : "moj-filter moj-hidden"}
                    chipLabel={dateFilterState.label[0]}
                    paramName="dateRange"
                  />
                  <FilterChip
                    tag={lockedFilterState.filter[0] !== undefined ? "moj-filter__tag" : "moj-filter moj-hidden"}
                    chipLabel={lockedFilterState.label[0]}
                    paramName="locked"
                  />
                  {reasonFilterState.filter[0].map((reason: string) => (
                    <FilterChip key={reason} tag="moj-filter__tag" chipLabel={reason} paramName="type" />
                  ))}
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
            <CourtCaseTypeOptions
              courtCaseTypes={courtCaseTypes}
              onClick={(option: string) => {
                reasonFilterState.filter[1]([...reasonFilterState.filter[0], option])
                reasonFilterState.label[1](option)
              }}
            />
          </div>
          <div className="govuk-form-group">
            <CourtDateFilterOptions
              dateRange={dateRange}
              onClick={(option: string) => {
                dateFilterState.filter[1](option)
                dateFilterState.label[1](option)
              }}
            />
          </div>
          <div>
            <UrgencyFilterOptions
              urgency={urgency}
              onClick={(option: string) => {
                const filterValue = option === "Urgent" ? true : option === "Non-urgent" ? false : undefined
                urgentFilterState.filter[1](filterValue)
                urgentFilterState.label[1](option)
              }}
            />
          </div>
          <div>
            <LockedFilterOptions
              locked={locked}
              onClick={(option: string) => {
                const filterValue = option === "Locked" ? true : option === "Unlocked" ? false : undefined
                lockedFilterState.filter[1](filterValue)
                lockedFilterState.label[1](option)
              }}
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
