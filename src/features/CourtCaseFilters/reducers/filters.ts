import { Reason } from "types/CaseListQueryParams"
import type { Filter, FilterAction } from "types/CourtCaseFilter"
import { caseStateLabels } from "utils/caseStateFilters"

const handleAddingFilters = (newState: Filter, action: FilterAction) => {
  switch (action.type) {
    case "urgency": {
      newState.urgentFilter.value = action.value
      newState.urgentFilter.label = action.value ? "Urgent" : "Non-urgent"
      newState.urgentFilter.state = "Selected"
      break
    }
    case "caseAge": {
      if (newState.caseAgeFilter.filter((caseAgeFilter) => caseAgeFilter.value === action.value).length < 1) {
        newState.caseAgeFilter.push({ value: action.value, state: "Selected" })
      }
      break
    }
    case "dateFrom": {
      newState.dateFrom.value = action.value
      newState.dateFrom.state = "Selected"
      break
    }
    case "dateTo": {
      newState.dateTo.value = action.value
      newState.dateTo.state = "Selected"
      break
    }
    case "caseState": {
      newState.caseStateFilter.value = action.value
      newState.caseStateFilter.label = caseStateLabels[action.value ?? ""]
      newState.caseStateFilter.state = "Selected"
      break
    }
    case "locked": {
      newState.lockedFilter.value = action.value
      newState.lockedFilter.label = action.value ? "Locked" : "Unlocked"
      newState.lockedFilter.state = "Selected"
      break
    }
    case "myCases": {
      newState.myCasesFilter.value = action.value
      newState.myCasesFilter.label = action.value ? "Cases locked to me" : undefined
      newState.myCasesFilter.state = "Selected"
      break
    }
    case "reason": {
      newState.reasonFilter.value = action.value
      newState.reasonFilter.state = "Selected"
      break
    }
    case "defendantName": {
      newState.defendantNameSearch.value = action.value
      newState.defendantNameSearch.label = action.value
      newState.defendantNameSearch.state = "Selected"
      break
    }
    case "courtName": {
      newState.courtNameSearch.value = action.value
      newState.courtNameSearch.label = action.value
      newState.courtNameSearch.state = "Selected"
      break
    }
    case "reasonCodes": {
      newState.reasonCodes = action.value.split(" ").map((reason: string) => ({
        value: reason,
        label: reason,
        state: "Selected"
      }))

      break
    }
    case "ptiurn": {
      newState.ptiurnSearch.value = action.value
      newState.ptiurnSearch.label = action.value
      newState.ptiurnSearch.state = "Selected"
      break
    }
  }
}

const handleRemovingFilters = (newState: Filter, action: FilterAction) => {
  switch (action.type) {
    case "urgency": {
      newState.urgentFilter.value = undefined
      newState.urgentFilter.label = undefined
      break
    }
    case "caseAge": {
      if (action.value) {
        newState.caseAgeFilter = newState.caseAgeFilter.filter((caseAgeFilter) => caseAgeFilter.value !== action.value)
      } else {
        newState.caseAgeFilter = []
      }
      break
    }
    case "dateRange": {
      newState.dateFrom.value = undefined
      newState.dateTo.value = undefined
      break
    }
    case "caseState": {
      newState.caseStateFilter.value = undefined
      newState.caseStateFilter.label = undefined
      break
    }
    case "locked": {
      newState.lockedFilter.value = undefined
      newState.lockedFilter.label = undefined
      break
    }
    case "myCases": {
      newState.myCasesFilter.value = undefined
      newState.myCasesFilter.label = undefined
      break
    }
    case "reason": {
      newState.reasonFilter.value = Reason.All
      newState.reasonFilter.state = "Selected"
      break
    }
    case "defendantName": {
      newState.defendantNameSearch.value = ""
      newState.defendantNameSearch.label = undefined
      break
    }
    case "courtName": {
      newState.courtNameSearch.value = ""
      newState.courtNameSearch.label = undefined
      break
    }
    case "reasonCodes": {
      newState.reasonCodes = newState.reasonCodes.filter((reasonCode) => reasonCode.value !== action.value)
      break
    }
    case "ptiurn": {
      newState.ptiurnSearch.value = ""
      newState.ptiurnSearch.label = undefined
      break
    }
  }
}

const filters = (state: Filter, action: FilterAction): Filter => {
  const newState = Object.assign({}, state)

  if (action.method === "add") {
    handleAddingFilters(newState, action)
  } else if (action.method === "remove") {
    handleRemovingFilters(newState, action)
  }

  return newState
}

export { filters as filtersReducer }
export default filters
