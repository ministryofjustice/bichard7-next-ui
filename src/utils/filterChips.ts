import { Reason } from "types/CaseListQueryParams"
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
      state.myCasesFilter
    ].some(
      (filter): boolean =>
        filter?.value !== undefined &&
        filter.value !== "" &&
        (countOfState === undefined || filter.state === countOfState)
    ) ||
    state.caseAgeFilter.some((filter) => countOfState === undefined || filter.state === countOfState) ||
    (!!state.reasonFilter && state.reasonFilter.value !== Reason.All && state.reasonFilter.state === countOfState)
  )
}

export { anyFilterChips }
