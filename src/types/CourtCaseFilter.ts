import { CaseState, CaseAge, Reason } from "./CaseListQueryParams"

export type FilterAction =
  | { method: FilterMethod; type: "defendantName"; value: string }
  | { method: FilterMethod; type: "courtName"; value: string }
  | { method: FilterMethod; type: "reasonCode"; value: string }
  | { method: FilterMethod; type: "ptiurn"; value: string }
  | { method: FilterMethod; type: "urgency"; value: boolean }
  | { method: FilterMethod; type: "caseAge"; value: CaseAge }
  | { method: "add"; type: "dateFrom"; value: Date }
  | { method: "add"; type: "dateTo"; value: Date }
  | { method: "remove"; type: "dateRange"; value: string }
  | { method: FilterMethod; type: "locked"; value: boolean }
  | { method: FilterMethod; type: "reason"; value: Reason }
  | { method: FilterMethod; type: "caseState"; value: CaseState }
  | { method: FilterMethod; type: "myCases"; value: boolean }

export type FilterType = "urgency" | "date" | "locked" | "reason" | "dateFrom" | "dateTo"
export type FilterMethod = "add" | "remove"
export type FilterValue = boolean | string | Reason
export type FilterState = "Selected" | "Applied"
export type Filter = {
  urgentFilter: {
    value?: boolean
    state?: FilterState
    label?: string
  }
  caseAgeFilter: {
    value: CaseAge
    state: FilterState
  }[]
  dateFrom: {
    value?: Date
    state?: FilterState
  }
  dateTo: {
    value?: Date
    state?: FilterState
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
  reasonCode: {
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
    value?: boolean
    state?: FilterState
    label?: string
  }
}
