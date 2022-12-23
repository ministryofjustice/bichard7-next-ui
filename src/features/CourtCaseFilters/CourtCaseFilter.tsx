/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { HintText } from "govuk-react"
import { useReducer } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { Filter, FilterAction } from "types/CourtCaseFilter"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"
import FilterChipSection from "./FilterChipSection"

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
      newState.urgentFilter.state = "Selected"
    } else if (action.type === "date") {
      newState.dateFilter.value = action.value
      newState.dateFilter.label = action.value
      newState.dateFilter.state = "Selected"
    } else if (action.type === "locked") {
      newState.lockedFilter.value = action.value
      newState.lockedFilter.label = action.value ? "Locked" : "Unlocked"
      newState.lockedFilter.state = "Selected"
    } else if (action.type === "reason") {
      // React might invoke our reducer more than once for a single event,
      // so avoid duplicating reason filters
      if (newState.reasonFilter.filter((reasonFilter) => reasonFilter.value === action.value).length < 1) {
        newState.reasonFilter.push({ value: action.value, state: "Selected" })
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
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "Applied", label: urgency } : {},
    dateFilter: dateRange !== null ? { value: dateRange, state: "Applied", label: dateRange } : {},
    lockedFilter: locked !== null ? { value: locked === "Locked", state: "Applied", label: locked } : {},
    reasonFilter: courtCaseTypes.map((courtCaseType) => {
      return { value: courtCaseType, state: "Applied" }
    })
  }

  const [state, dispatch] = useReducer(reducer, initialFilterState)
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
              <FilterChipSection state={state} dispatch={dispatch} sectionState={"Applied"} />
              <FilterChipSection state={state} dispatch={dispatch} sectionState={"Selected"} />
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
