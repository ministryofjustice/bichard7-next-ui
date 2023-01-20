/* eslint-disable @typescript-eslint/no-non-null-assertion */
import FilterChip from "components/FilterChip"
import If from "components/If"
import { Dispatch } from "react"
import { Filter, FilterAction, FilterState } from "types/CourtCaseFilter"
import { anyFilterChips } from "utils/filterChips"
import FilterChipRow from "./FilterChipRow"

interface Props {
  state: Filter
  dispatch: Dispatch<FilterAction>
  sectionState: FilterState
  marginTop: boolean
}

const FilterChipSection: React.FC<Props> = ({ state, dispatch, sectionState, marginTop }: Props) => {
  return (
    <If condition={anyFilterChips(state, sectionState)}>
      <h2
        className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
      >{`${sectionState} filters`}</h2>

      <FilterChipRow
        chipLabel={state.defendantNameSearch.label!}
        condition={
          state.defendantNameSearch.value !== undefined &&
          state.defendantNameSearch.label !== undefined &&
          state.defendantNameSearch.state === sectionState
        }
        dispatch={dispatch}
        type="defendantName"
        label="Defendant name"
        state={state.defendantNameSearch.state || sectionState}
        value={state.defendantNameSearch.value!}
      />

      <FilterChipRow
        chipLabel={state.ptiurnSearch.label!}
        condition={
          state.ptiurnSearch.value !== undefined &&
          state.ptiurnSearch.label !== undefined &&
          state.ptiurnSearch.state === sectionState
        }
        dispatch={dispatch}
        type="ptiurn"
        label="PTIURN"
        state={state.ptiurnSearch.state || sectionState}
        value={state.ptiurnSearch.value!}
      />

      <FilterChipRow
        chipLabel={state.courtNameSearch.label!}
        condition={
          state.courtNameSearch.value !== undefined &&
          state.courtNameSearch.label !== undefined &&
          state.courtNameSearch.state === sectionState
        }
        dispatch={dispatch}
        type="courtName"
        label="Court name"
        state={state.courtNameSearch.state || sectionState}
        value={state.courtNameSearch.value!}
      />

      <If condition={state.reasonFilter.filter((reasonFilter) => reasonFilter.state === sectionState).length > 0}>
        <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Reason"}</h3>
        <ul className="moj-filter-tags govuk-!-margin-bottom-0">
          {state.reasonFilter
            .filter((reasonFilter) => reasonFilter.state === sectionState)
            .map((reasonFilter) => (
              <FilterChip
                key={reasonFilter.value}
                chipLabel={reasonFilter.value}
                dispatch={dispatch}
                removeAction={() => {
                  return { method: "remove", type: "reason", value: reasonFilter.value }
                }}
                state={reasonFilter.state}
              />
            ))}
        </ul>
      </If>

      <FilterChipRow
        chipLabel={state.urgentFilter.label!}
        condition={
          state.urgentFilter.value !== undefined &&
          state.urgentFilter.label !== undefined &&
          state.urgentFilter.state === sectionState
        }
        dispatch={dispatch}
        type="urgency"
        label="Urgency"
        state={state.urgentFilter.state || sectionState}
        value={state.urgentFilter.value!}
      />

      <FilterChipRow
        chipLabel={state.dateFilter.label!}
        condition={
          state.dateFilter.value !== undefined &&
          state.dateFilter.label !== undefined &&
          state.dateFilter.state === sectionState
        }
        dispatch={dispatch}
        type="date"
        label="Date range"
        state={state.dateFilter.state || sectionState}
        value={state.dateFilter.value!}
      />

      <FilterChipRow
        chipLabel={state.caseStateFilter.label!}
        condition={
          state.caseStateFilter.value !== undefined &&
          state.caseStateFilter.label !== undefined &&
          state.caseStateFilter.state === sectionState
        }
        dispatch={dispatch}
        type="caseState"
        label="Case state"
        state={state.caseStateFilter.state || sectionState}
        value={state.caseStateFilter.value!}
      />

      <FilterChipRow
        chipLabel={state.lockedFilter.label!}
        condition={
          state.lockedFilter.value !== undefined &&
          state.lockedFilter.label !== undefined &&
          state.lockedFilter.state === sectionState
        }
        dispatch={dispatch}
        type="locked"
        label="Locked state"
        state={state.lockedFilter.state || sectionState}
        value={state.lockedFilter.value!}
      />
    </If>
  )
}

export default FilterChipSection
