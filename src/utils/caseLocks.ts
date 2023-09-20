import { CourtCaseIndex } from "types/display/CourtCases"

const triggersAreLockedByCurrentUser = (courtCase: CourtCaseIndex, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername === username

const exceptionsAreLockedByCurrentUser = (courtCase: CourtCaseIndex, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername === username

const isLockedByCurrentUser = (courtCase: CourtCaseIndex, username: string) =>
  triggersAreLockedByCurrentUser(courtCase, username) || exceptionsAreLockedByCurrentUser(courtCase, username)

const exceptionsAreLockedByAnotherUser = (courtCase: CourtCaseIndex, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== username

const triggersAreLockedByAnotherUser = (courtCase: CourtCaseIndex, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername !== username

const isLockedByAnotherUser = (courtCase: CourtCaseIndex, username: string) =>
  exceptionsAreLockedByAnotherUser(courtCase, username) || triggersAreLockedByAnotherUser(courtCase, username)

export {
  exceptionsAreLockedByAnotherUser,
  exceptionsAreLockedByCurrentUser,
  isLockedByAnotherUser,
  isLockedByCurrentUser,
  triggersAreLockedByAnotherUser,
  triggersAreLockedByCurrentUser
}
