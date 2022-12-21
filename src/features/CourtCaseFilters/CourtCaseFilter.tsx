/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import FilterChip from "components/FilterChip"
import If from "components/If"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { HintText } from "govuk-react"
import { useReducer } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction, Filter } from "types/CourtCaseFilter"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"

interface Props {
  courtCaseTypes: Reason[]
  dateRange: string | null
  urgency: string | null
  locked: string | null
}

const reducer = (state: Filter, action: FilterAction): Filter => {
  const newState = Object.assign({}, state)
  if (action.method === "add") {
    if (action.type === "urgency") {
      newState.urgentFilter.value = action.value
      newState.urgentFilter.label = action.value ? "Urgent" : "Non-urgent"
      newState.urgentFilter.state = "selected"
    } else if (action.type === "date") {
      newState.dateFilter.value = action.value
      newState.dateFilter.label = action.value
      newState.dateFilter.state = "selected"
    } else if (action.type === "locked") {
      newState.lockedFilter.value = action.value
      newState.lockedFilter.label = action.value ? "Locked" : "Unlocked"
      newState.lockedFilter.state = "selected"
    } else if (action.type === "reason") {
      // React might invoke our reducer more than once for a single event,
      // so avoid duplicating reason filters
      if (newState.reasonFilter.filter((reasonFilter) => reasonFilter.value === action.value).length < 1) {
        newState.reasonFilter.push({ value: action.value, state: "selected" })
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
      newState.reasonFilter = newState.reasonFilter.filter((reasonFilter) => reasonFilter.value !== action.value)
    }
  }
  return newState
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, dateRange, urgency, locked }: Props) => {
  const initialFilterState: Filter = {
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "applied", label: urgency } : {},
    dateFilter: dateRange !== null ? { value: dateRange, state: "applied", label: dateRange } : {},
    lockedFilter: locked !== null ? { value: locked === "Locked", state: "applied", label: locked } : {},
    reasonFilter: courtCaseTypes.map((courtCaseType) => {
      return { value: courtCaseType, state: "applied" }
    })
  }

  const [state, dispatch] = useReducer(reducer, initialFilterState)

  console.log(state)

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
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Urgency"}</h3>
                  <FilterChip
                    chipLabel={state.urgentFilter.label!}
                    dispatch={dispatch}
                    removeAction={() => {
                      return { method: "remove", type: "urgency", value: state.urgentFilter.value! }
                    }}
                  />
                </If>
                <If condition={state.dateFilter.value !== undefined && state.dateFilter.label !== undefined}>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Date range"}</h3>
                  <FilterChip
                    chipLabel={state.dateFilter.label!}
                    dispatch={dispatch}
                    removeAction={() => {
                      return { method: "remove", type: "date", value: state.dateFilter.value! }
                    }}
                  />
                </If>
                <If condition={state.lockedFilter.value !== undefined && state.lockedFilter.label !== undefined}>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Locked state"}</h3>
                  <FilterChip
                    chipLabel={state.lockedFilter.label!}
                    dispatch={dispatch}
                    removeAction={() => {
                      return { method: "remove", type: "locked", value: state.lockedFilter.value! }
                    }}
                  />
                </If>
                <If condition={state.reasonFilter.length > 0}>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Reason"}</h3>
                </If>

                {state.reasonFilter.map((reasonFilter) => (
                  <FilterChip
                    key={reasonFilter.value}
                    chipLabel={reasonFilter.value}
                    dispatch={dispatch}
                    removeAction={() => {
                      return { method: "remove", type: "reason", value: reasonFilter.value }
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
            <CourtCaseTypeOptions
              courtCaseTypes={state.reasonFilter.map((reasonFilter) => reasonFilter.value)}
              dispatch={dispatch}
            />
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
