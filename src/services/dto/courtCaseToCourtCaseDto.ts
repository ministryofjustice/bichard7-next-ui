import CourtCase from "services/entities/CourtCase"

const courtCaseToCourtCaseDto = (courtCase: CourtCase) => {
  const courtCaseObj = courtCase.serialize()

  if (courtCaseObj.errorLockedByUser) {
    delete courtCaseObj.errorLockedByUser.groups
    delete courtCaseObj.errorLockedByUser.hasAccessTo
  }

  if (courtCaseObj.triggerLockedByUser) {
    delete courtCaseObj.triggerLockedByUser.groups
    delete courtCaseObj.triggerLockedByUser.hasAccessTo
  }

  if (courtCaseObj.notes.length > 0) {
    courtCaseObj.notes = courtCaseObj.notes.map((note: { user: { groups: unknown; hasAccessTo: unknown } }) => {
      const user = note.user

      if (user) {
        delete note.user.groups
        delete note.user.hasAccessTo
      }

      return note
    })
  }

  return courtCaseObj
}

export default courtCaseToCourtCaseDto
