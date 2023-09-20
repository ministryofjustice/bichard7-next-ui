import CourtCase from "services/entities/CourtCase"
import { CourtCaseIndex, CourtCaseInfo } from "types/display/CourtCases"
import { noteToDisplayNote } from "./noteDto"
import { triggerToDisplayTrigger } from "./triggerDto"

export const courtCaseToCourtCaseIndexDto = (courtCase: CourtCase): CourtCaseIndex => {
  const courtCaseIndex: CourtCaseIndex = {
    asn: courtCase.asn,
    courtDate: courtCase.courtDate ? courtCase.courtDate.toISOString() : undefined,
    courtName: courtCase.courtName,
    errorId: courtCase.errorId,
    errorLockedByUsername: courtCase.errorLockedByUsername,
    errorReport: courtCase.errorReport,
    isUrgent: courtCase.isUrgent,
    notes: courtCase.notes.map(noteToDisplayNote),
    ptiurn: courtCase.ptiurn,
    resolutionTimestamp: courtCase.resolutionTimestamp ? courtCase.resolutionTimestamp.toISOString() : null,
    triggerLockedByUsername: courtCase.triggerLockedByUsername,
    triggers: courtCase.triggers.map(triggerToDisplayTrigger),
    triggerCount: courtCase.triggerCount,
    defendantName: courtCase.defendantName
  }

  if (courtCase.errorLockedByUserFullName) {
    courtCaseIndex.errorLockedByUserFullName = courtCase.errorLockedByUserFullName
  }

  if (courtCase.triggerLockedByUserFullName) {
    courtCaseIndex.triggerLockedByUserFullName = courtCase.triggerLockedByUserFullName
  }

  return courtCaseIndex
}

export const courtCaseToCourtCaseInfoDto = (courtCase: CourtCase): CourtCaseInfo => {
  const courtCaseInfo: CourtCaseInfo = {
    ...courtCaseToCourtCaseIndexDto(courtCase),
    orgForPoliceFilter: courtCase.orgForPoliceFilter,
    courtCode: courtCase.courtCode,
    courtReference: courtCase.courtReference
  }

  return courtCaseInfo
}
