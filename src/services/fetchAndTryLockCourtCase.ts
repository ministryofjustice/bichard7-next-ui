import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import getCourtCase from "./getCourtCase"
import tryToLockCourtCase from "./tryToLockCourtCase"
import unlockCourtCase from "./unlockCourtCase"

type fetchAndTryLockCourtCaseResult = { courtCase?: CourtCase; error?: boolean }

const fetchAndTryLockCourtCase = async (
  currentUser: User,
  courtCaseId: number,
  dataSource: DataSource,
  lock: boolean
): Promise<fetchAndTryLockCourtCaseResult> => {
  let lockResult: boolean | Error
  if (lock) {
    lockResult = await tryToLockCourtCase(dataSource, courtCaseId, currentUser.username)
  } else {
    lockResult = await unlockCourtCase(dataSource, courtCaseId)
  }

  if (!lockResult || isError(lockResult)) {
    return {
      error: true
    }
  }

  const courtCase = await getCourtCase(dataSource, courtCaseId, currentUser.visibleForces)
  if (!courtCase) {
    return {
      error: true
    }
  }
  if (isError(courtCase)) {
    console.error(courtCase.message)
    return {
      error: true
    }
  }

  return {
    courtCase
  }
}

export type { fetchAndTryLockCourtCaseResult }
export { fetchAndTryLockCourtCase }
