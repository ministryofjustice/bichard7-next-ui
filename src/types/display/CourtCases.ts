import CourtCase from "services/entities/CourtCase"
import { DisplayNote } from "./Notes"
import { DisplayTrigger } from "./Triggers"

type FieldsForCourtCaseIndex =
  | "asn"
  | "courtName"
  | "errorId"
  | "errorLockedByUsername"
  | "errorReport"
  | "isUrgent"
  | "ptiurn"
  | "triggerLockedByUsername"
  | "triggerCount"
  | "defendantName"

export type CourtCaseIndex = Pick<CourtCase, FieldsForCourtCaseIndex> & {
  courtDate?: string
  errorLockedByUserFullName?: string
  triggerLockedByUserFullName?: string
  notes: DisplayNote[]
  triggers: DisplayTrigger[]
  resolutionTimestamp: string | null
}

type FieldsForCourtCaseInfo = FieldsForCourtCaseIndex | "orgForPoliceFilter" | "courtCode" | "courtReference"

export type CourtCaseInfo = Pick<CourtCase, FieldsForCourtCaseInfo> & {
  courtDate?: string
  errorLockedByUserFullName?: string
  triggerLockedByUserFullName?: string
  notes: DisplayNote[]
  triggers: DisplayTrigger[]
  resolutionTimestamp: string | null
}
