import CaseStateFilterOptions from "components/CaseStateFilter/CaseStateFilterOptions"
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import If from "components/If"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { LabelText } from "govuk-react"
import { ChangeEvent, useReducer } from "react"
import { createUseStyles } from "react-jss"
import { CaseState, MyCaseState, Reason } from "types/CaseListQueryParams"
import type { Filter, FilterAction } from "types/CourtCaseFilter"
import { caseStateLabels } from "utils/caseStateFilters"
import { anyFilterChips } from "utils/filterChips"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"
import ExpandingFilters from "./ExpandingFilters"
import FilterChipSection from "./FilterChipSection"

interface Props {
  defendantName: string | null
  courtName: string | null
  reasonSearch: string | null
  ptiurn: string | null
  courtCaseTypes: Reason[]
  dateRange: string | null
  urgency: string | null
  locked: string | null
  caseState: CaseState | null
  myCaseState: MyCaseState | null
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
    } else if (action.type === "caseState") {
      newState.caseStateFilter.value = action.value
      newState.caseStateFilter.label = caseStateLabels[action.value ?? ""]
      newState.caseStateFilter.state = "Selected"
    } else if (action.type === "locked") {
      newState.lockedFilter.value = action.value
      newState.lockedFilter.label = action.value ? "Locked" : "Unlocked"
      newState.lockedFilter.state = "Selected"
    } else if (action.type === "myCases") {
      newState.myCasesFilter.value = action.value
      newState.myCasesFilter.label = action.value ? "Locked to me" : undefined
      newState.myCasesFilter.state = "Selected"
    } else if (action.type === "reason") {
      // React might invoke our reducer more than once for a single event,
      // so avoid duplicating reason filters
      if (newState.reasonFilter.filter((reasonFilter) => reasonFilter.value === action.value).length < 1) {
        newState.reasonFilter.push({ value: action.value, state: "Selected" })
      }
    } else if (action.type === "defendantName") {
      newState.defendantNameSearch.value = action.value
      newState.defendantNameSearch.label = action.value
      newState.defendantNameSearch.state = "Selected"
    } else if (action.type === "courtName") {
      newState.courtNameSearch.value = action.value
      newState.courtNameSearch.label = action.value
      newState.courtNameSearch.state = "Selected"
    } else if (action.type === "reasonSearch") {
      newState.reasonSearch.value = action.value
      newState.reasonSearch.label = action.value
      newState.reasonSearch.state = "Selected"
    } else if (action.type === "ptiurn") {
      newState.ptiurnSearch.value = action.value
      newState.ptiurnSearch.label = action.value
      newState.ptiurnSearch.state = "Selected"
    }
  } else if (action.method === "remove") {
    if (action.type === "urgency") {
      newState.urgentFilter.value = undefined
      newState.urgentFilter.label = undefined
    } else if (action.type === "date") {
      newState.dateFilter.value = undefined
      newState.dateFilter.label = undefined
    } else if (action.type === "caseState") {
      newState.caseStateFilter.value = undefined
      newState.caseStateFilter.label = undefined
    } else if (action.type === "locked") {
      newState.lockedFilter.value = undefined
      newState.lockedFilter.label = undefined
    } else if (action.type === "myCases") {
      newState.myCasesFilter.value = undefined
      newState.myCasesFilter.label = undefined
    } else if (action.type === "reason") {
      newState.reasonFilter = newState.reasonFilter.filter((reasonFilter) => reasonFilter.value !== action.value)
    } else if (action.type === "defendantName") {
      newState.defendantNameSearch.value = ""
      newState.defendantNameSearch.label = undefined
    } else if (action.type === "courtName") {
      newState.courtNameSearch.value = ""
      newState.courtNameSearch.label = undefined
    } else if (action.type === "reasonSearch") {
      newState.reasonSearch.value = ""
      newState.reasonSearch.label = undefined
    } else if (action.type === "ptiurn") {
      newState.ptiurnSearch.value = ""
      newState.ptiurnSearch.label = undefined
    }
  }
  return newState
}

const useStyles = createUseStyles({
  "govuk-form-group": {
    marginBottom: "0"
  }
})

const CourtCaseFilter: React.FC<Props> = ({
  courtCaseTypes,
  defendantName,
  ptiurn,
  courtName,
  reasonSearch,
  dateRange,
  urgency,
  locked,
  caseState,
  myCaseState
}: Props) => {
  const initialFilterState: Filter = {
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "Applied", label: urgency } : {},
    dateFilter: dateRange !== null ? { value: dateRange, state: "Applied", label: dateRange } : {},
    lockedFilter: locked !== null ? { value: locked === "Locked", state: "Applied", label: locked } : {},
    caseStateFilter: caseState !== null ? { value: caseState, state: "Applied", label: caseState } : {},
    defendantNameSearch: defendantName !== null ? { value: defendantName, state: "Applied", label: defendantName } : {},
    courtNameSearch: courtName !== null ? { value: courtName, state: "Applied", label: courtName } : {},
    reasonSearch: reasonSearch !== null ? { value: reasonSearch, state: "Applied", label: reasonSearch } : {},
    ptiurnSearch: ptiurn !== null ? { value: ptiurn, state: "Applied", label: ptiurn } : {},
    reasonFilter: courtCaseTypes.map((courtCaseType) => {
      return { value: courtCaseType, state: "Applied" }
    }),
    myCasesFilter: myCaseState !== null ? { value: myCaseState, state: "Applied", label: myCaseState } : {}
  }
  const [state, dispatch] = useReducer(reducer, initialFilterState)

  const classes = useStyles()

  return (
    <form method={"get"} id="filter-panel">
      <div className="moj-filter__header">
        <div className="moj-filter__header-title">
          <h2 className="govuk-heading-m">{"Filter"}</h2>
        </div>
        <div className="moj-filter__header-action"></div>
      </div>
      <div className="moj-filter__content">
        <If condition={anyFilterChips(state)}>
          <div className="moj-filter__selected">
            <div className="moj-filter__selected-heading">
              <div className="moj-filter__heading-title">
                <FilterChipSection state={state} dispatch={dispatch} sectionState={"Applied"} marginTop={false} />
                <FilterChipSection
                  state={state}
                  dispatch={dispatch}
                  sectionState={"Selected"}
                  marginTop={anyFilterChips(state, "Applied")}
                />
              </div>
            </div>
          </div>
        </If>
        <div className="moj-filter__options">
          <button className="govuk-button" data-module="govuk-button" id="search">
            {"Apply filters"}
          </button>
          <div className={classes["govuk-form-group"]}>
            <label className="govuk-label govuk-label--m">{"Search"}</label>
            <div>
              <label className="govuk-label govuk-label--s" htmlFor="keywords">
                <LabelText>{"Defendant name"}</LabelText>
                <input
                  className="govuk-input"
                  value={state.defendantNameSearch.value}
                  id="keywords"
                  name="keywords"
                  type="text"
                  onChange={(event) => {
                    dispatch({ method: "add", type: "defendantName", value: event.currentTarget.value })
                  }}
                />
              </label>
              <label className="govuk-label govuk-label--s" htmlFor="court-name">
                <LabelText>{"Court name"}</LabelText>
                <input
                  className="govuk-input"
                  value={state.courtNameSearch.value}
                  id="court-name"
                  name="courtName"
                  type="text"
                  onChange={(event) => {
                    dispatch({ method: "add", type: "courtName", value: event.currentTarget.value })
                  }}
                />
              </label>
              <label className="govuk-label govuk-label--s" htmlFor="reason-search">
                <LabelText>{"Reason"}</LabelText>
                <input
                  className="govuk-input"
                  value={state.reasonSearch.value}
                  id="reason-search"
                  name="reasonSearch"
                  type="text"
                  onChange={(event) => {
                    dispatch({ method: "add", type: "reasonSearch", value: event.currentTarget.value })
                  }}
                />
              </label>
              <label className="govuk-label govuk-label--s" htmlFor="ptiurn">
                <LabelText>{"PTIURN"}</LabelText>
                <input
                  className="govuk-input"
                  value={state.ptiurnSearch.value}
                  id="ptiurn"
                  name="ptiurn"
                  type="text"
                  onChange={(event) => {
                    dispatch({ method: "add", type: "ptiurn", value: event.currentTarget.value })
                  }}
                />
              </label>
            </div>
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Case type"}>
              <CourtCaseTypeOptions
                courtCaseTypes={state.reasonFilter.map((reasonFilter) => reasonFilter.value)}
                dispatch={dispatch}
              />
            </ExpandingFilters>
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Urgency"}>
              <UrgencyFilterOptions urgency={state.urgentFilter.value} dispatch={dispatch} />
            </ExpandingFilters>
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Court date"}>
              <CourtDateFilterOptions dateRange={state.dateFilter.value} dispatch={dispatch} />
            </ExpandingFilters>
          </div>
          <div>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Case state"}>
              <CaseStateFilterOptions state={state.caseStateFilter.value} dispatch={dispatch} />
            </ExpandingFilters>
          </div>
          <div>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Locked state"}>
              <LockedFilterOptions locked={state.lockedFilter.value} dispatch={dispatch} />
            </ExpandingFilters>
          </div>
          <div>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-body">{"My cases"}</legend>
              <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="my-cases-filter"
                    name="myCases"
                    type="checkbox"
                    value={state.myCasesFilter.value}
                    checked={state.myCasesFilter.value === "View cases allocated to me"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        method: "add",
                        type: "myCases",
                        value: event.currentTarget.checked ? "View cases allocated to me" : undefined
                      })
                    }}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="my-cases-filter">
                    {"View cases allocated to me"}
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
