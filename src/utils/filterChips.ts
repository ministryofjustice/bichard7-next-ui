import { Filter, FilterState } from "types/CourtCaseFilter"

const anyFilterChips = (state: Filter, countOfState?: FilterState): boolean => {
  return (
    [
      state.dateFilter,
      state.customDateFilter,
      state.lockedFilter,
      state.urgentFilter,
      state.caseStateFilter,
      state.defendantNameSearch,
      state.courtNameSearch,
      state.reasonSearch,
      state.ptiurnSearch
    ]
      .map((filter): number => {
        return filter.value !== undefined && (countOfState === undefined || filter.state === countOfState) ? 1 : 0
      })
      .reduce((x, y) => x + y, 0) +
      state.reasonFilter.filter((filter) => countOfState === undefined || filter.state === countOfState).length >
    0
  )
}

export { anyFilterChips }
