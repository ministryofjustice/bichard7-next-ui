import { CaseState, Reason, SerializedCourtDateRange } from "./CaseListQueryParams"

type SearchParams = {
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  caseState: CaseState | null
  courtName: string | null
  dateRange: SerializedCourtDateRange | null
  defendantName: string | null
  lockedState: string | null
  order: string | null
  orderBy: string | null
  ptiurn: string | null
  reason: Reason | null
  reasonCodes: string[]
  urgency: string | null
}

export default SearchParams
