import type { CourtDateRange } from "./CaseListQueryParams"

type CaseAgeOptionKey =
  | "Today"
  | "Yesterday"
  | "2 days ago"
  | "3 days ago"
  | "4 days ago"
  | "5 days ago"
  | "6 days ago"
  | "7 days ago"
  | "8 days ago"
  | "9 days ago"
  | "10 days ago"
  | "11 days ago"
  | "12 days ago"
  | "13 days ago"
  | "14 days ago"
  | "15 days ago and older"

type CaseAgeOption = { [key in CaseAgeOptionKey]: () => CourtDateRange }

export default CaseAgeOption
