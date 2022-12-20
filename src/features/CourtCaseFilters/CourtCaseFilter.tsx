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

const reducer = (state: FilterState, action: FilterAction) => {
  const newState = Object.assign({}, state)
  if (action.method === "add") {
    if (action.type === "urgency") {
      newState.urgentFilter.value = action.value
      newState.urgentFilter.label = action.value ? "Urgent" : "Non-urgent"
    } else if (action.type === "date") {
      newState.dateFilter.value = action.value
      newState.dateFilter.label = action.value
    } else if (action.type === "locked") {
      newState.lockedFilter.value = action.value
      newState.lockedFilter.label = action.value ? "Locked" : "Unlocked"
    } else if (action.type === "reason") {
      // React might invoke our reducer more than once for a single event,
      // so avoid duplicating reason filters
      if (!newState.reasonFilter.value.includes(action.value)) {
        newState.reasonFilter.value.push(action.value)
      }
    }
  } else if (action.method === "remove") {
    if (action.type === "urgency") {
      newState.urgentFilter.value = undefined
      newState.urgentFilter.label = undefined
    } else if (action.type === "date") {
      newState.dateFilter.value = undefined
      newState.dateFilter.label = undefined
    } else if (action.type === "locked") {
      newState.lockedFilter.value = undefined
      newState.dateFilter.label = undefined
    } else if (action.type === "reason") {
      newState.reasonFilter.value = newState.reasonFilter.value.filter((reason: string) => reason !== action.value)
    }
  }
  return newState
}

const CourtCaseFilter: React.FC = () => {
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
            <CourtCaseTypeOptions courtCaseTypes={state.reasonFilter.value} dispatch={dispatch} />
          </div>
          <div className="govuk-form-group">
            <CourtDateFilterOptions dateRange={state.dateFilter.value} dispatch={dispatch} />
          </div>
          <div>
            <UrgencyFilterOptions urgency={state.urgentFilter.value} dispatch={dispatch} />
          </div>
          <div>
            <LockedFilterOptions locked={state.lockedFilter.value} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
