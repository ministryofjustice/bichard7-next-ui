import { Reason } from "./CaseListQueryParams"

export type FilterAction =
  | { method: FilterMethod; type: "urgency"; value: boolean }
  | { method: FilterMethod; type: "date"; value: string }
  | { method: FilterMethod; type: "locked"; value: boolean }
  | { method: FilterMethod; type: "reason"; value: Reason }

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
  reasonFilter: {
    value: Reason
    state: FilterState
  }[]
}
