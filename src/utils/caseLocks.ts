import { DisplayFullCourtCase } from "types/display/CourtCases"

const triggersAreLockedByCurrentUser = (courtCase: DisplayFullCourtCase, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername === username

const exceptionsAreLockedByCurrentUser = (courtCase: DisplayFullCourtCase, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername === username

const isLockedByCurrentUser = (courtCase: DisplayFullCourtCase, username: string) =>
  triggersAreLockedByCurrentUser(courtCase, username) || exceptionsAreLockedByCurrentUser(courtCase, username)

const exceptionsAreLockedByAnotherUser = (courtCase: DisplayFullCourtCase, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== username

const triggersAreLockedByAnotherUser = (courtCase: DisplayFullCourtCase, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername !== username

const isLockedByAnotherUser = (courtCase: DisplayFullCourtCase, username: string) =>
  exceptionsAreLockedByAnotherUser(courtCase, username) || triggersAreLockedByAnotherUser(courtCase, username)

export {
  exceptionsAreLockedByAnotherUser,
  exceptionsAreLockedByCurrentUser,
  isLockedByAnotherUser,
  isLockedByCurrentUser,
  triggersAreLockedByAnotherUser,
  triggersAreLockedByCurrentUser
}
