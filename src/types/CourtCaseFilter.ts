import { CaseState, Reason } from "./CaseListQueryParams"

export type FilterAction =
  | { method: FilterMethod; type: "defendantName"; value: string }
  | { method: FilterMethod; type: "courtName"; value: string }
  | { method: FilterMethod; type: "reasonSearch"; value: string }
  | { method: FilterMethod; type: "ptiurn"; value: string }
  | { method: FilterMethod; type: "urgency"; value: boolean }
  | { method: FilterMethod; type: "date"; value: string }
  | { method: FilterMethod; type: "locked"; value: boolean }
  | { method: FilterMethod; type: "reason"; value: Reason }
  | { method: FilterMethod; type: "caseState"; value: CaseState }
  | { method: FilterMethod; type: "myCases"; value: string }

export type FilterType = "urgency" | "date" | "locked" | "reason"
export type FilterMethod = "add" | "remove"
export type FilterValue = boolean | string | Reason
export type FilterState = "Selected" | "Applied"
export type Filter = {
  urgentFilter: {
    value?: boolean
    state?: FilterState
    label?: string
  }
  dateFilter: {
    value?: string
    state?: FilterState
    label?: string
  }
  lockedFilter: {
    value?: boolean
    state?: FilterState
    label?: string
  }
  caseStateFilter: {
    value?: CaseState
    state?: FilterState
    label?: string
  }
  defendantNameSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  courtNameSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  reasonSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  ptiurnSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  reasonFilter: {
    value: Reason
    state: FilterState
  }[]
  myCasesFilter: {
    value?: string
    state?: FilterState
    label?: string
  }
}
