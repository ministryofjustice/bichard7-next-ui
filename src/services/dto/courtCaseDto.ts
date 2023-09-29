import { camelCase } from "lodash"
import CourtCase from "services/entities/CourtCase"
import { DisplayFullCourtCase, DisplayPartialCourtCase } from "types/display/CourtCases"
import { formatUserFullName } from "utils/formatUserFullName"
import { noteToDisplayNoteDto, noteToDisplayPartialNoteDto } from "./noteDto"
import { triggerToDisplayTriggerDto, triggerToPartialDisplayTriggerDto } from "./triggerDto"

export const courtCaseToDisplayPartialCourtCaseDto = (courtCase: CourtCase): DisplayPartialCourtCase => {
  const sanitisedCourtCase = Object.entries(courtCase).reduce(
    (acc, item) => ({ ...acc, [camelCase(item[0].replace(/courtCase_/g, ""))]: item[1] }),
    {}
  ) as CourtCase

  const displayPartialCourtCase: DisplayPartialCourtCase = {
    asn: sanitisedCourtCase.asn,
    courtDate: sanitisedCourtCase.courtDate ? sanitisedCourtCase.courtDate.toISOString() : undefined,
    courtName: sanitisedCourtCase.courtName,
    errorId: sanitisedCourtCase.errorId,
    errorLockedByUsername: sanitisedCourtCase.errorLockedByUsername,
    errorReport: sanitisedCourtCase.errorReport,
    isUrgent: sanitisedCourtCase.isUrgent,
    noteCount: sanitisedCourtCase.noteCount ? sanitisedCourtCase.noteCount : 0,
    note: null,
    ptiurn: sanitisedCourtCase.ptiurn,
    resolutionTimestamp: sanitisedCourtCase.resolutionTimestamp
      ? sanitisedCourtCase.resolutionTimestamp.toISOString()
      : null,
    triggerLockedByUsername: sanitisedCourtCase.triggerLockedByUsername,
    triggerCount: sanitisedCourtCase.triggerCount,
    defendantName: sanitisedCourtCase.defendantName,
    triggers: sanitisedCourtCase.triggerCodes
      ? sanitisedCourtCase.triggerCodes.split(",").map(triggerToPartialDisplayTriggerDto)
      : []
  }

  if (sanitisedCourtCase.mostRecentNoteText && sanitisedCourtCase.mostRecentNoteDate) {
    displayPartialCourtCase.note = noteToDisplayPartialNoteDto(
      sanitisedCourtCase.mostRecentNoteText,
      sanitisedCourtCase.mostRecentNoteDate
    )
  }

  if (sanitisedCourtCase.errorLockedByUserFullName) {
    displayPartialCourtCase.errorLockedByUserFullName = sanitisedCourtCase.errorLockedByUserFullName
  } else if (sanitisedCourtCase.errorLockedByUserForenames && sanitisedCourtCase.errorLockedByUserSurname) {
    displayPartialCourtCase.errorLockedByUserFullName = formatUserFullName(
      sanitisedCourtCase.errorLockedByUserForenames,
      sanitisedCourtCase.errorLockedByUserSurname
    )
  }

  if (sanitisedCourtCase.triggerLockedByUserFullName) {
    displayPartialCourtCase.triggerLockedByUserFullName = sanitisedCourtCase.triggerLockedByUserFullName
  } else if (sanitisedCourtCase.triggerLockedByUserForenames && sanitisedCourtCase.triggerLockedByUserSurname) {
    displayPartialCourtCase.triggerLockedByUserFullName = formatUserFullName(
      sanitisedCourtCase.triggerLockedByUserForenames,
      sanitisedCourtCase.triggerLockedByUserSurname
    )
  }

  return displayPartialCourtCase
}

export const courtCaseToDisplayFullCourtCaseDto = (courtCase: CourtCase): DisplayFullCourtCase => {
  const courtCaseInfo: DisplayFullCourtCase = {
    ...courtCaseToDisplayPartialCourtCaseDto(courtCase),
    orgForPoliceFilter: courtCase.orgForPoliceFilter,
    courtCode: courtCase.courtCode,
    courtReference: courtCase.courtReference,
    phase: courtCase.phase,
    triggers: courtCase.triggers.map(triggerToDisplayTriggerDto),
    notes: courtCase.notes.map(noteToDisplayNoteDto)
  }

  return courtCaseInfo
}
