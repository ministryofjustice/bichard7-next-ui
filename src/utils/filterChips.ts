import { Filter, FilterState } from "types/CourtCaseFilter"

const countFilterChips = (state: Filter, countOfState?: FilterState): number => {
  return (
    [state.dateFilter, state.lockedFilter, state.urgentFilter, state.caseStateFilter]
      .map((filter): number => {
        return filter.value !== undefined && (countOfState === undefined || filter.state === countOfState) ? 1 : 0
      })
      .reduce((x, y) => x + y, 0) +
    state.reasonFilter.filter((filter) => countOfState === undefined || filter.state === countOfState).length
  )
}

export { countFilterChips }
