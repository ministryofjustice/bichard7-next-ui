import { camelCase } from "lodash"
import CourtCase from "services/entities/CourtCase"
import { DisplayFullCourtCase, DisplayPartialCourtCase } from "types/display/CourtCases"
import { formatUserFullName } from "utils/formatUserFullName"
import { noteToDisplayNoteDto, noteToDisplayPartialNoteDto } from "./noteDto"
import { triggerToDisplayTriggerDto, triggerToPartialDisplayTriggerDto } from "./triggerDto"

export const courtCaseToDisplayPartialCourtCaseDto = (courtCase: CourtCase): DisplayPartialCourtCase => {
  const displayPartialCourtCase: DisplayPartialCourtCase = {
    asn: courtCase.asn,
    courtDate: courtCase.courtDate ? courtCase.courtDate.toISOString() : undefined,
    courtName: courtCase.courtName,
    errorId: courtCase.errorId,
    errorLockedByUsername: courtCase.errorLockedByUsername,
    errorReport: courtCase.errorReport,
    isUrgent: courtCase.isUrgent,
    noteCount: courtCase.noteCount ? +courtCase.noteCount : 0,
    note: null,
    resolutionTimestamp: null,
    ptiurn: courtCase.ptiurn,
    triggerLockedByUsername: courtCase.triggerLockedByUsername,
    triggerCount: courtCase.triggerCount,
    defendantName: courtCase.defendantName,
    triggers: courtCase.triggerCodes ? courtCase.triggerCodes.split(",").map(triggerToPartialDisplayTriggerDto) : []
  }

  if (courtCase.resolutionTs) {
    displayPartialCourtCase.resolutionTimestamp = courtCase.resolutionTs ? courtCase.resolutionTs.toISOString() : null
  } else {
    displayPartialCourtCase.resolutionTimestamp = courtCase.resolutionTimestamp
      ? courtCase.resolutionTimestamp.toISOString()
      : null
  }

  if (courtCase.mostRecentNoteText && courtCase.mostRecentNoteDate) {
    displayPartialCourtCase.note = noteToDisplayPartialNoteDto(
      courtCase.mostRecentNoteText,
      courtCase.mostRecentNoteDate
    )
  }

  if (courtCase.errorLockedByUserFullName) {
    displayPartialCourtCase.errorLockedByUserFullName = courtCase.errorLockedByUserFullName
  } else if (courtCase.errorLockedByUserForenames && courtCase.errorLockedByUserSurname) {
    displayPartialCourtCase.errorLockedByUserFullName = formatUserFullName(
      courtCase.errorLockedByUserForenames,
      courtCase.errorLockedByUserSurname
    )
  }

  if (courtCase.triggerLockedByUserFullName) {
    displayPartialCourtCase.triggerLockedByUserFullName = courtCase.triggerLockedByUserFullName
  } else if (courtCase.triggerLockedByUserForenames && courtCase.triggerLockedByUserSurname) {
    displayPartialCourtCase.triggerLockedByUserFullName = formatUserFullName(
      courtCase.triggerLockedByUserForenames,
      courtCase.triggerLockedByUserSurname
    )
  }

  return displayPartialCourtCase
}

export const rawCourtCaseToDisplayPartialCourtCaseDto = (courtCase: CourtCase): DisplayPartialCourtCase => {
  const sanitisedCourtCase = Object.entries(courtCase).reduce(
    (acc, item) => ({ ...acc, [camelCase(item[0].replace(/courtCase_/g, ""))]: item[1] }),
    {}
  ) as CourtCase

  return courtCaseToDisplayPartialCourtCaseDto(sanitisedCourtCase)
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
