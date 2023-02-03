/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CaseStateFilterOptions from "components/CaseStateFilter/CaseStateFilterOptions"
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import If from "components/If"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { LabelText } from "govuk-react"
import { ReactNode, useState, useReducer } from "react"
import { createUseStyles } from "react-jss"
import { CaseState, Reason } from "types/CaseListQueryParams"
import type { Filter, FilterAction } from "types/CourtCaseFilter"
import { anyFilterChips } from "utils/filterChips"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"
import FilterChipSection from "./FilterChipSection"
import { caseStateLabels } from "utils/caseStateFilters"

interface Props {
  defendantName: string | null
  courtName: string | null
  reasonSearch: string | null
  ptiurn: string | null
  courtCaseTypes: Reason[]
  dateRange: string | null
  customDateRange: string | null
  urgency: string | null
  locked: string | null
  caseState: CaseState | null
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
    } else if (action.type === "customDate") {
      newState.customDateFilter.value = action.value
      newState.customDateFilter.label = action.value
      newState.customDateFilter.state = "Selected"
    } else if (action.type === "caseState") {
      newState.caseStateFilter.value = action.value
      newState.caseStateFilter.label = caseStateLabels[action.value ?? ""]
      newState.caseStateFilter.state = "Selected"
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
    } else if (action.type === "customDate") {
      newState.customDateFilter.value = undefined
      newState.customDateFilter.label = undefined
    } else if (action.type === "caseState") {
      newState.caseStateFilter.value = undefined
      newState.caseStateFilter.label = undefined
    } else if (action.type === "locked") {
      newState.lockedFilter.value = undefined
      newState.lockedFilter.label = undefined
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
  legendColour: {
    color: "#1D70B8"
  },
  legendContainer: {
    marginTop: "8px"
  },
  iconButton: {
    border: "3px solid transparent",
    backgroundColor: "transparent",
    "&:active": {
      backgroundColor: "#b0b4b6"
    }
  },
  container: {
    marginLeft: "-10px",
    width: "fit-content",
    paddingRight: "10px",
    display: "flex",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#b0b4b6"
    },
    "&:active": {
      backgroundColor: "#b0b4b6"
    }
  },
  "govuk-form-group": {
    marginBottom: "0"
  }
})

const UpArrow: React.FC = () => (
  <svg width={18} height={10} viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.999926 9.28432L8.74976 1.56866L16.4996 9.28432" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const DownArrow: React.FC = () => (
  <svg width={18} height={11} viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9994 1.26702L9.26685 9L1.49977 1.30171" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const ExpandingFilters: React.FC<{ filterName: string; children: ReactNode }> = ({
  filterName,
  children
}: {
  filterName: string
  children: ReactNode
}) => {
  const [caseTypeIsVisible, setCaseTypeVisible] = useState(true)
  const classes = useStyles()
  return (
    <fieldset className="govuk-fieldset">
      <div
        className={classes.container}
        onClick={() => {
          setCaseTypeVisible(!caseTypeIsVisible)
        }}
      >
        <button type="button" className={classes.iconButton} aria-label={`${filterName} filter options`}>
          {caseTypeIsVisible ? <UpArrow /> : <DownArrow />}
        </button>
        <div className={classes.legendContainer}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <div className={classes.legendColour}>{filterName}</div>
          </legend>
        </div>
      </div>
      <If condition={caseTypeIsVisible}>{children}</If>
    </fieldset>
  )
}

const CourtCaseFilter: React.FC<Props> = ({
  courtCaseTypes,
  defendantName,
  ptiurn,
  courtName,
  reasonSearch,
  dateRange,
  customDateRange,
  urgency,
  locked,
  caseState
}: Props) => {
  const initialFilterState: Filter = {
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "Applied", label: urgency } : {},
    dateFilter: dateRange !== null ? { value: dateRange, state: "Applied", label: dateRange } : {},
    customDateFilter:
      customDateRange !== null ? { value: customDateRange, state: "Applied", label: customDateRange } : {},
    lockedFilter: locked !== null ? { value: locked === "Locked", state: "Applied", label: locked } : {},
    caseStateFilter: caseState !== null ? { value: caseState, state: "Applied", label: caseState } : {},
    defendantNameSearch: defendantName !== null ? { value: defendantName, state: "Applied", label: defendantName } : {},
    courtNameSearch: courtName !== null ? { value: courtName, state: "Applied", label: courtName } : {},
    reasonSearch: reasonSearch !== null ? { value: reasonSearch, state: "Applied", label: reasonSearch } : {},
    ptiurnSearch: ptiurn !== null ? { value: ptiurn, state: "Applied", label: ptiurn } : {},
    reasonFilter: courtCaseTypes.map((courtCaseType) => {
      return { value: courtCaseType, state: "Applied" }
    })
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
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
