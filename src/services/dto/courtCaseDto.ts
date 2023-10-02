import CourtCase from "services/entities/CourtCase"
import { DisplayFullCourtCase, DisplayPartialCourtCase } from "types/display/CourtCases"
import { noteToDisplayNoteDto } from "./noteDto"
import { triggerToDisplayTriggerDto } from "./triggerDto"
import { ResolutionStatus } from "../../types/ResolutionStatus"

export const courtCaseToDisplayPartialCourtCaseDto = (courtCase: CourtCase): DisplayPartialCourtCase => {
  const displayPartialCourtCase: DisplayPartialCourtCase = {
    asn: courtCase.asn,
    courtDate: courtCase.courtDate ? courtCase.courtDate.toISOString() : undefined,
    courtName: courtCase.courtName,
    errorId: courtCase.errorId,
    errorLockedByUsername: courtCase.errorLockedByUsername,
    errorReport: courtCase.errorReport,
    isUrgent: courtCase.isUrgent,
    notes: courtCase.notes.map(noteToDisplayNoteDto),
    ptiurn: courtCase.ptiurn,
    resolutionTimestamp: courtCase.resolutionTimestamp ? courtCase.resolutionTimestamp.toISOString() : null,
    triggerLockedByUsername: courtCase.triggerLockedByUsername,
    triggers: courtCase.triggers.map(triggerToDisplayTriggerDto),
    triggerCount: courtCase.triggerCount,
    defendantName: courtCase.defendantName,
    errorStatus: courtCase.errorStatus ? (courtCase.errorStatus as ResolutionStatus) : null
  }

  if (courtCase.errorLockedByUserFullName) {
    displayPartialCourtCase.errorLockedByUserFullName = courtCase.errorLockedByUserFullName
  }

  if (courtCase.triggerLockedByUserFullName) {
    displayPartialCourtCase.triggerLockedByUserFullName = courtCase.triggerLockedByUserFullName
  }

  return displayPartialCourtCase
}

export const courtCaseToDisplayFullCourtCaseDto = (courtCase: CourtCase): DisplayFullCourtCase => {
  const courtCaseInfo: DisplayFullCourtCase = {
    ...courtCaseToDisplayPartialCourtCaseDto(courtCase),
    orgForPoliceFilter: courtCase.orgForPoliceFilter,
    courtCode: courtCase.courtCode,
    courtReference: courtCase.courtReference,
    phase: courtCase.phase
  }

  return courtCaseInfo
}
