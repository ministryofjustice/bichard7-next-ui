import ConditionalRender from "components/ConditionalRender"
import LockedFilter, { lockedStateShortLabels } from "components/SearchFilters/LockedFilter"
import ReasonFilter from "components/SearchFilters/ReasonFilterOptions/ReasonFilter"
import TextFilter from "components/SearchFilters/TextFilter"
import { useCurrentUser } from "context/CurrentUserContext"
import { FormGroup } from "govuk-react"
import { ChangeEvent, useReducer } from "react"
import { CaseState, LockedState, Reason, SerializedCourtDateRange } from "types/CaseListQueryParams"
import type { Filter } from "types/CourtCaseFilter"
import Permission from "types/Permission"
import { anyFilterChips } from "utils/filterChips"
import { reasonOptions } from "utils/reasonOptions"
import CourtDateFilter from "../../components/SearchFilters/CourtDateFilter"
import { SelectedFiltersContainer } from "./CourtCaseFilter.styles"
import FilterChipSection from "./FilterChipSection"
import { filtersReducer } from "./reducers/filters"

interface Props {
  defendantName: string | null
  courtName: string | null
  reasonCodes: string[]
  ptiurn: string | null
  reason: Reason | null
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  dateRange: SerializedCourtDateRange | null
  urgency: string | null
  lockedState: string | null
  caseState: CaseState | null
  order: string | null
  orderBy: string | null
}

const Divider = () => (
  <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
)

const CourtCaseFilter: React.FC<Props> = ({
  reason,
  defendantName,
  ptiurn,
  courtName,
  reasonCodes,
  caseAge,
  caseAgeCounts,
  dateRange,
  urgency,
  lockedState,
  caseState,
  order,
  orderBy
}: Props) => {
  const lockedStateValue = lockedState ?? LockedState.All
  const initialFilterState: Filter = {
    urgentFilter: urgency !== null ? { value: urgency === "Urgent", state: "Applied", label: urgency } : {},
    caseAgeFilter: caseAge.map((slaDate) => {
      return { value: slaDate, state: "Applied" }
    }),
    dateFrom: dateRange !== null ? { value: dateRange.from, state: "Applied" } : {},
    dateTo: dateRange !== null ? { value: dateRange.to, state: "Applied" } : {},
    lockedStateFilter:
      lockedState !== null
        ? { value: lockedStateValue, state: "Applied", label: lockedStateShortLabels[lockedStateValue] }
        : {},
    caseStateFilter: caseState !== null ? { value: caseState, state: "Applied", label: caseState } : {},
    defendantNameSearch: defendantName !== null ? { value: defendantName, state: "Applied", label: defendantName } : {},
    courtNameSearch: courtName !== null ? { value: courtName, state: "Applied", label: courtName } : {},
    reasonCodes: reasonCodes.map((reasonCode) => ({ value: reasonCode, state: "Applied", label: reasonCode })),
    ptiurnSearch: ptiurn !== null ? { value: ptiurn, state: "Applied", label: ptiurn } : {},
    reasonFilter: reason !== null ? { value: reason, state: "Applied" } : {}
  }
  const [state, dispatch] = useReducer(filtersReducer, initialFilterState)
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
            <SelectedFiltersContainer className={`moj-filter__heading-title`}>
              <FilterChipSection state={state} dispatch={dispatch} sectionState={"Applied"} marginTop={false} />
              <FilterChipSection
                state={state}
                dispatch={dispatch}
                sectionState={"Selected"}
                marginTop={anyFilterChips(state, "Applied")}
                placeholderMessage={"No filters selected"}
              />
            </SelectedFiltersContainer>
          </div>
        </div>
        <div className="moj-filter__options">
          <button className="govuk-button" data-module="govuk-button" id="search">
            {"Apply filters"}
          </button>

          <input type="hidden" id="order" name="order" value={order || ""} />
          <input type="hidden" id="orderBy" name="orderBy" value={orderBy || ""} />

          <FormGroup className={"govuk-form-group"}>
            <h2 className="govuk-heading-m">{"Search"}</h2>
            <div>
              <TextFilter
                label="Reason codes"
                id="reasonCodes"
                value={state.reasonCodes.map((reasonCode) => reasonCode.value).join(" ")}
                dispatch={dispatch}
              />
              <TextFilter
                label="Defendant name"
                id="defendantName"
                value={state.defendantNameSearch.value}
                dispatch={dispatch}
              />
              <TextFilter label="Court name" id="courtName" value={state.courtNameSearch.value} dispatch={dispatch} />
              <TextFilter label="PTIURN" id="ptiurn" value={state.ptiurnSearch.value} dispatch={dispatch} />
            </div>
          </FormGroup>

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <Divider />
            <ReasonFilter reason={state.reasonFilter.value} reasonOptions={reasonOptions} dispatch={dispatch} />
          </ConditionalRender>

          <Divider />
          <CourtDateFilter
            caseAges={state.caseAgeFilter.map((slaDate) => slaDate.value as string)}
            caseAgeCounts={caseAgeCounts}
            dispatch={dispatch}
            dateRange={{ from: state.dateFrom.value, to: state.dateTo.value }}
          />

          <Divider />
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

          <Divider />
          <LockedFilter lockedState={state.lockedStateFilter.value} dispatch={dispatch} />
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter
