/* eslint-disable @typescript-eslint/no-non-null-assertion */
import FilterChip from "components/FilterChip"
import If from "components/If"
import { Dispatch } from "react"
import { Filter, FilterAction, FilterState } from "types/CourtCaseFilter"
import { countFilterChips } from "utils/filterChips"

interface Props {
  state: Filter
  dispatch: Dispatch<FilterAction>
  sectionState: FilterState
}

const FilterChipSection: React.FC<Props> = ({ state, dispatch, sectionState }: Props) => {
  return (
    <If condition={countFilterChips(state, sectionState) > 0}>
      <h2 className="govuk-heading-m govuk-!-margin-bottom-0">{`${sectionState} filters`}</h2>

      <If
        condition={
          state.urgentFilter.value !== undefined &&
          state.urgentFilter.label !== undefined &&
          state.urgentFilter.state === sectionState
        }
      >
        <h3>{"Urgency"}</h3>
        <ul className="moj-filter-tags">
          <FilterChip
            chipLabel={state.urgentFilter.label!}
            dispatch={dispatch}
            removeAction={() => {
              return { method: "remove", type: "urgency", value: state.urgentFilter.value! }
            }}
            state={state.urgentFilter.state || sectionState}
          />
        </ul>
      </If>
      <If
        condition={
          state.dateFilter.value !== undefined &&
          state.dateFilter.label !== undefined &&
          state.dateFilter.state === sectionState
        }
      >
        <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Date range"}</h3>
        <ul className="moj-filter-tags">
          <FilterChip
            chipLabel={state.dateFilter.label!}
            dispatch={dispatch}
            removeAction={() => {
              return { method: "remove", type: "date", value: state.dateFilter.value! }
            }}
            state={state.dateFilter.state || sectionState}
          />
        </ul>
      </If>
      <If
        condition={
          state.lockedFilter.value !== undefined &&
          state.lockedFilter.label !== undefined &&
          state.lockedFilter.state === sectionState
        }
      >
        <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Locked state"}</h3>
        <ul className="moj-filter-tags">
          <FilterChip
            chipLabel={state.lockedFilter.label!}
            dispatch={dispatch}
            removeAction={() => {
              return { method: "remove", type: "locked", value: state.lockedFilter.value! }
            }}
            state={state.lockedFilter.state || sectionState}
          />
        </ul>
      </If>
      <If condition={state.reasonFilter.filter((reasonFilter) => reasonFilter.state === sectionState).length > 0}>
        <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Reason"}</h3>
        <ul className="moj-filter-tags">
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
    </If>
  )
}

export default FilterChipSection
