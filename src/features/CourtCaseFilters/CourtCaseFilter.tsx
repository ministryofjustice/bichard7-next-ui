import ConditionalRender from "components/ConditionalRender"
import LockedFilterOptions from "components/FilterOptions/LockedFilterOptions"
import ReasonFilterOptions from "components/FilterOptions/ReasonFilterOptions/ReasonFilterOptions"
import { useCurrentUser } from "context/CurrentUserContext"
import { LabelText } from "govuk-react"
import { ChangeEvent, useReducer } from "react"
import { createUseStyles } from "react-jss"
import { CaseState, Reason, SerializedCourtDateRange } from "types/CaseListQueryParams"
import type { Filter } from "types/CourtCaseFilter"
import Permission from "types/Permission"
import { anyFilterChips } from "utils/filterChips"
import CourtDateFilterOptions from "../../components/FilterOptions/CourtDateFilterOptions"
import ExpandingFilters from "./ExpandingFilters"
import FilterChipSection from "./FilterChipSection"
import { filtersReducer } from "./reducers/filters"

interface Props {
  defendantName: string | null
  courtName: string | null
  reasonCodes: string[]
  ptiurn: string | null
  reasons: Reason[]
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  dateRange: SerializedCourtDateRange | null
  urgency: string | null
  locked: string | null
  caseState: CaseState | null
  myCases: boolean
  order: string | null
  orderBy: string | null
}

const useStyles = createUseStyles({
  "govuk-form-group": {
    marginBottom: "0"
  },
  selectedFiltersContainer: {
    display: "block"
  }
})

const CourtCaseFilter: React.FC<Props> = ({
  reasons,
  defendantName,
  ptiurn,
  courtName,
  reasonCodes,
  caseAge,
  caseAgeCounts,
  dateRange,
  urgency,
  locked,
  caseState,
  myCases,
  order,
  orderBy
}: Props) => {
  const initialFilterState: Filter = {
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "Applied", label: urgency } : {},
    caseAgeFilter: caseAge.map((slaDate) => {
      return { value: slaDate, state: "Applied" }
    }),
    dateFrom: dateRange !== null ? { value: dateRange.from, state: "Applied" } : {},
    dateTo: dateRange !== null ? { value: dateRange.to, state: "Applied" } : {},
    lockedFilter: locked !== null ? { value: locked === "Locked", state: "Applied", label: locked } : {},
    caseStateFilter: caseState !== null ? { value: caseState, state: "Applied", label: caseState } : {},
    defendantNameSearch: defendantName !== null ? { value: defendantName, state: "Applied", label: defendantName } : {},
    courtNameSearch: courtName !== null ? { value: courtName, state: "Applied", label: courtName } : {},
    reasonCodes: reasonCodes.map((reasonCode) => ({ value: reasonCode, state: "Applied", label: reasonCode })),
    ptiurnSearch: ptiurn !== null ? { value: ptiurn, state: "Applied", label: ptiurn } : {},
    reasonFilter: reasons.map((reason) => {
      return { value: reason, state: "Applied" }
    }),
    myCasesFilter: myCases ? { value: true, state: "Applied", label: "Cases locked to me" } : {}
  }
  const [state, dispatch] = useReducer(filtersReducer, initialFilterState)
  const classes = useStyles()
  const currentUser = useCurrentUser()

  return (
    <form method={"get"} id="filter-panel">
      <div className="moj-filter__header">
        <div className="moj-filter__header-title">
          <h2 className="govuk-heading-m">{"Search panel"}</h2>
        </div>
        <div className="moj-filter__header-action"></div>
      </div>
      <div className="moj-filter__content">
        <div className="moj-filter__selected">
          <div className="moj-filter__selected-heading">
            <div className={`moj-filter__heading-title ${classes.selectedFiltersContainer}`}>
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

          <input type="hidden" id="order" name="order" value={order || ""} />
          <input type="hidden" id="orderBy" name="orderBy" value={orderBy || ""} />

          <div className={classes["govuk-form-group"]}>
            <label className="govuk-label govuk-label--m">{"Search"}</label>
            <div>
              <label className="govuk-label govuk-label--s" htmlFor="reason-code">
                <LabelText>{"Reason code"}</LabelText>
                <div className="govuk-input__wrapper">
                  <div className="govuk-input__prefix" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.6999 10.6C12.0747 10.6 13.9999 8.67482 13.9999 6.3C13.9999 3.92518 12.0747 2 9.6999 2C7.32508 2 5.3999 3.92518 5.3999 6.3C5.3999 8.67482 7.32508 10.6 9.6999 10.6ZM9.6999 12.6C13.1793 12.6 15.9999 9.77939 15.9999 6.3C15.9999 2.82061 13.1793 0 9.6999 0C6.22051 0 3.3999 2.82061 3.3999 6.3C3.3999 9.77939 6.22051 12.6 9.6999 12.6Z"
                        fill="#0B0C0C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.70706 10.7071L1.70706 15.7071L0.292847 14.2929L5.29285 9.29289L6.70706 10.7071Z"
                        fill="#0B0C0C"
                      />
                    </svg>
                  </div>
                  <input
                    className="govuk-input"
                    value={state.reasonCodes.map((reason) => reason.value).join(" ")}
                    id="reason-codes"
                    name="reasonCodes"
                    type="text"
                    onChange={(event) => {
                      dispatch({ method: "add", type: "reasonCodes", value: event.currentTarget.value })
                    }}
                  />
                </div>
              </label>
              <label className="govuk-label govuk-label--s" htmlFor="keywords">
                <LabelText>{"Defendant name"}</LabelText>
                <div className="govuk-input__wrapper">
                  <div className="govuk-input__prefix" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.6999 10.6C12.0747 10.6 13.9999 8.67482 13.9999 6.3C13.9999 3.92518 12.0747 2 9.6999 2C7.32508 2 5.3999 3.92518 5.3999 6.3C5.3999 8.67482 7.32508 10.6 9.6999 10.6ZM9.6999 12.6C13.1793 12.6 15.9999 9.77939 15.9999 6.3C15.9999 2.82061 13.1793 0 9.6999 0C6.22051 0 3.3999 2.82061 3.3999 6.3C3.3999 9.77939 6.22051 12.6 9.6999 12.6Z"
                        fill="#0B0C0C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.70706 10.7071L1.70706 15.7071L0.292847 14.2929L5.29285 9.29289L6.70706 10.7071Z"
                        fill="#0B0C0C"
                      />
                    </svg>
                  </div>
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
                </div>
              </label>
              <label className="govuk-label govuk-label--s" htmlFor="court-name">
                <LabelText>{"Court name"}</LabelText>
                <div className="govuk-input__wrapper">
                  <div className="govuk-input__prefix" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.6999 10.6C12.0747 10.6 13.9999 8.67482 13.9999 6.3C13.9999 3.92518 12.0747 2 9.6999 2C7.32508 2 5.3999 3.92518 5.3999 6.3C5.3999 8.67482 7.32508 10.6 9.6999 10.6ZM9.6999 12.6C13.1793 12.6 15.9999 9.77939 15.9999 6.3C15.9999 2.82061 13.1793 0 9.6999 0C6.22051 0 3.3999 2.82061 3.3999 6.3C3.3999 9.77939 6.22051 12.6 9.6999 12.6Z"
                        fill="#0B0C0C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.70706 10.7071L1.70706 15.7071L0.292847 14.2929L5.29285 9.29289L6.70706 10.7071Z"
                        fill="#0B0C0C"
                      />
                    </svg>
                  </div>
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
                </div>
              </label>
              <label className="govuk-label govuk-label--s" htmlFor="ptiurn">
                <LabelText>{"PTIURN"}</LabelText>
                <div className="govuk-input__wrapper">
                  <div className="govuk-input__prefix" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.6999 10.6C12.0747 10.6 13.9999 8.67482 13.9999 6.3C13.9999 3.92518 12.0747 2 9.6999 2C7.32508 2 5.3999 3.92518 5.3999 6.3C5.3999 8.67482 7.32508 10.6 9.6999 10.6ZM9.6999 12.6C13.1793 12.6 15.9999 9.77939 15.9999 6.3C15.9999 2.82061 13.1793 0 9.6999 0C6.22051 0 3.3999 2.82061 3.3999 6.3C3.3999 9.77939 6.22051 12.6 9.6999 12.6Z"
                        fill="#0B0C0C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.70706 10.7071L1.70706 15.7071L0.292847 14.2929L5.29285 9.29289L6.70706 10.7071Z"
                        fill="#0B0C0C"
                      />
                    </svg>
                  </div>
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
                </div>
              </label>
            </div>
          </div>
          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <div className={`${classes["govuk-form-group"]} reasons`}>
              <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
              <ExpandingFilters filterName={"Reason"}>
                <ReasonFilterOptions
                  reasons={state.reasonFilter.map((reasonFilter) => reasonFilter.value)}
                  reasonOptions={
                    currentUser.hasAccessTo[Permission.Triggers] && !currentUser.hasAccessTo[Permission.Exceptions]
                      ? [Reason.Bails]
                      : undefined
                  }
                  dispatch={dispatch}
                />
              </ExpandingFilters>
            </div>
          </ConditionalRender>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Court date"}>
              <CourtDateFilterOptions
                caseAges={state.caseAgeFilter.map((slaDate) => slaDate.value as string)}
                caseAgeCounts={caseAgeCounts}
                dispatch={dispatch}
                dateRange={{ from: state.dateFrom.value, to: state.dateTo.value }}
              />
            </ExpandingFilters>
          </div>
          <div>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-body">{"Case state"}</legend>
              <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="resolved"
                    name="state"
                    type="checkbox"
                    value={state.caseStateFilter.value}
                    checked={state.caseStateFilter.value == "Resolved"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        method: event.currentTarget.checked ? "add" : "remove",
                        type: "caseState",
                        value: "Resolved"
                      })
                    }}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="resolved">
                    {"View resolved cases"}
                  </label>
                </div>
              </div>
            </fieldset>
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
                    checked={!!state.myCasesFilter.value}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        method: "add",
                        type: "myCases",
                        value: event.currentTarget.checked
                      })
                    }}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="my-cases-filter">
                    {"View cases locked to me"}
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
