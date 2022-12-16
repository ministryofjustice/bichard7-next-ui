/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import FilterChip from "components/FilterChip"
import If from "components/If"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { HintText } from "govuk-react"
import { useReducer } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction, FilterState } from "types/CourtCaseFilter"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"

interface Props {
  courtCaseTypes?: Reason[]
  dateRange?: string | null
  urgency?: string | null
  locked?: string | null
}

const reducer = (state: FilterState, action: FilterAction) => {
  if (action.method === "add") {
    if (action.type === "urgency") {
      state.urgentFilter.value = action.value
      state.urgentFilter.label = action.value ? "Urgent" : "Non-urgent"
    } else if (action.type === "date") {
      state.dateFilter.value = action.value
    } else if (action.type === "locked") {
      state.lockedFilter.value = action.value
    } else if (action.type === "reason") {
      // React might invoke our reducer more than once for a single event,
      // so avoid duplicating reason filters
      if (!state.reasonFilter.value.includes(action.value)) {
        state.reasonFilter.value.push(action.value)
      }
    }
  } else if (action.method === "remove") {
    if (action.type === "urgency") {
      state.urgentFilter.value = undefined
    } else if (action.type === "date") {
      state.dateFilter.value = undefined
    } else if (action.type === "locked") {
      state.lockedFilter.value = undefined
    } else if (action.type === "reason") {
      state.reasonFilter.value = state.reasonFilter.value.filter((reason: string) => reason === action.value)
    }
  }
  return state
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, dateRange, urgency, locked }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    urgentFilter: {},
    dateFilter: {},
    lockedFilter: {},
    reasonFilter: { value: [] }
  })

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
                  <If condition={state.urgentFilter.value !== undefined && state.urgentFilter.label !== undefined}>
                    <FilterChip
                      chipLabel={state.urgentFilter.label!}
                      dispatch={dispatch}
                      removeAction={() => {
                        return { method: "remove", type: "urgency", value: state.urgentFilter.value! }
                      }}
                    />
                  </If>
                  <If condition={state.dateFilter.value !== undefined && state.dateFilter.label !== undefined}>
                    <FilterChip
                      chipLabel={state.dateFilter.label!}
                      dispatch={dispatch}
                      removeAction={() => {
                        return { method: "remove", type: "date", value: state.dateFilter.value! }
                      }}
                    />
                  </If>
                  <If condition={state.lockedFilter.value !== undefined && state.lockedFilter.label !== undefined}>
                    <FilterChip
                      chipLabel={state.lockedFilter.label!}
                      dispatch={dispatch}
                      removeAction={() => {
                        return { method: "remove", type: "locked", value: state.lockedFilter.value! }
                      }}
                    />
                  </If>
                  {state.reasonFilter.value.map((reason: Reason) => (
                    <FilterChip
                      key={reason}
                      chipLabel={reason}
                      dispatch={dispatch}
                      removeAction={() => {
                        return { method: "remove", type: "reason", value: reason }
                      }}
                    />
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
            <CourtCaseTypeOptions courtCaseTypes={courtCaseTypes} dispatch={dispatch} />
          </div>
          <div className="govuk-form-group">
            <CourtDateFilterOptions dateRange={dateRange} dispatch={dispatch} />
          </div>
          <div>
            <UrgencyFilterOptions urgency={urgency} dispatch={dispatch} />
          </div>
          <div>
            <LockedFilterOptions locked={locked} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
