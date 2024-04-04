import { Filter, FilterState } from "types/CourtCaseFilter"

const anyFilterChips = (state: Filter, countOfState?: FilterState): boolean => {
  return (
    [
      state.dateFrom,
      state.dateTo,
      state.lockedFilter,
      state.urgentFilter,
      state.caseStateFilter,
      state.defendantNameSearch,
      state.courtNameSearch,
      state.reasonCodes[0],
      state.ptiurnSearch,
      state.myCasesFilter,
      state.recordTypeFilter
    ]
      .map((filter): number => {
        return filter?.value !== undefined &&
          filter.value !== "" &&
          (countOfState === undefined || filter.state === countOfState)
          ? 1
          : 0
      })
      .reduce((x, y) => x + y, 0) +
      state.caseAgeFilter.filter((filter) => countOfState === undefined || filter.state === countOfState).length >
    0
  )
}

export { anyFilterChips }
