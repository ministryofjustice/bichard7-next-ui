import CourtCase from "services/entities/CourtCase"

const triggersAreLockedByCurrentUser = (courtCase: CourtCase, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername === username

const exceptionsAreLockedByCurrentUser = (courtCase: CourtCase, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername === username

const isLockedByCurrentUser = (courtCase: CourtCase, username: string) =>
  triggersAreLockedByCurrentUser(courtCase, username) || exceptionsAreLockedByCurrentUser(courtCase, username)

const exceptionsAreLockedByAnotherUser = (courtCase: CourtCase, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== username

const triggersAreLockedByAnotherUser = (courtCase: CourtCase, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername !== username

const isLockedByAnotherUser = (courtCase: CourtCase, username: string) =>
  exceptionsAreLockedByAnotherUser(courtCase, username) || triggersAreLockedByAnotherUser(courtCase, username)

export {
  triggersAreLockedByCurrentUser,
  exceptionsAreLockedByCurrentUser,
  isLockedByCurrentUser,
  exceptionsAreLockedByAnotherUser,
  triggersAreLockedByAnotherUser,
  isLockedByAnotherUser
}
