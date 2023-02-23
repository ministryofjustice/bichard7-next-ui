import CaseStateFilterOptions from "components/CaseStateFilter/CaseStateFilterOptions"
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { LabelText } from "govuk-react"
import { ChangeEvent, useReducer } from "react"
import { createUseStyles } from "react-jss"
import { CaseState, Reason } from "types/CaseListQueryParams"
import type { Filter, FilterAction } from "types/CourtCaseFilter"
import { caseStateLabels } from "utils/caseStateFilters"
import { anyFilterChips } from "utils/filterChips"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"
import ExpandingFilters from "./ExpandingFilters"
import FilterChipSection from "./FilterChipSection"

interface Props {
  defendantName: string | null
  courtName: string | null
  reasonCode: string | null
  ptiurn: string | null
  courtCaseTypes: Reason[]
  dateRange: string | null
  customDateFrom: Date | null
  customDateTo: Date | null
  urgency: string | null
  locked: string | null
  caseState: CaseState | null
  myCases: boolean
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
    } else if (action.type === "customDateFrom") {
      newState.customDateFrom.value = action.value
      newState.customDateFrom.state = "Selected"
    } else if (action.type === "customDateTo") {
      newState.customDateTo.value = action.value
      newState.customDateTo.state = "Selected"
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
      newState.myCasesFilter.label = action.value ? "Cases locked to me" : undefined
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
    } else if (action.type === "reasonCode") {
      newState.reasonCode.value = action.value
      newState.reasonCode.label = action.value
      newState.reasonCode.state = "Selected"
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
    } else if (action.type === "customDate") {
      newState.customDateFrom.value = undefined
      newState.customDateTo.value = undefined
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
    } else if (action.type === "reasonCode") {
      newState.reasonCode.value = ""
      newState.reasonCode.label = undefined
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
  reasonCode,
  dateRange,
  customDateFrom,
  customDateTo,
  urgency,
  locked,
  caseState,
  myCases
}: Props) => {
  const initialFilterState: Filter = {
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "Applied", label: urgency } : {},
    dateFilter: dateRange !== null ? { value: dateRange, state: "Applied", label: dateRange } : {},
    customDateFrom: customDateFrom !== null ? { value: customDateFrom, state: "Applied" } : {},
    customDateTo: customDateTo !== null ? { value: customDateTo, state: "Applied" } : {},
    lockedFilter: locked !== null ? { value: locked === "Locked", state: "Applied", label: locked } : {},
    caseStateFilter: caseState !== null ? { value: caseState, state: "Applied", label: caseState } : {},
    defendantNameSearch: defendantName !== null ? { value: defendantName, state: "Applied", label: defendantName } : {},
    courtNameSearch: courtName !== null ? { value: courtName, state: "Applied", label: courtName } : {},
    reasonCode: reasonCode !== null ? { value: reasonCode, state: "Applied", label: reasonCode } : {},
    ptiurnSearch: ptiurn !== null ? { value: ptiurn, state: "Applied", label: ptiurn } : {},
    reasonFilter: courtCaseTypes.map((courtCaseType) => {
      return { value: courtCaseType, state: "Applied" }
    }),
    myCasesFilter: myCases ? { value: true, state: "Applied", label: "Cases locked to me" } : {}
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
        <div className="moj-filter__selected">
          <div className="moj-filter__selected-heading">
            <div className="moj-filter__heading-title">
              <FilterChipSection state={state} dispatch={dispatch} sectionState={"Applied"} marginTop={false} />
              <FilterChipSection
                state={state}
                dispatch={dispatch}
                sectionState={"Selected"}
                marginTop={anyFilterChips(state, "Applied")}
                placeholderMessage={"No filters selected"}
              />
            </div>
          </div>
        </div>
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
              <label className="govuk-label govuk-label--s" htmlFor="reason-code">
                <LabelText>{"Reason code"}</LabelText>
                <input
                  className="govuk-input"
                  value={state.reasonCode.value}
                  id="reason-code"
                  name="reasonCode"
                  type="text"
                  onChange={(event) => {
                    dispatch({ method: "add", type: "reasonCode", value: event.currentTarget.value })
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
              <CourtDateFilterOptions
                dateRange={state.dateFilter.value}
                dispatch={dispatch}
                customDateFrom={customDateFrom}
                customDateTo={customDateTo}
              />
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
                    value={"true"}
                    checked={state.myCasesFilter.value}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        method: "add",
                        type: "myCases",
                        value: event.currentTarget.checked
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
