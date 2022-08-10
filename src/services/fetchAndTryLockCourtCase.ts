import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import getCourtCase from "./getCourtCase"
import tryToLockCourtCase from "./tryToLockCourtCase"

type fetchAndTryLockCourtCaseResult = { courtCase?: CourtCase; error?: boolean }

const fetchAndTryLockCourtCase = async (
  currentUser: User,
  courtCaseId: number,
  dataSource: DataSource
): Promise<fetchAndTryLockCourtCaseResult> => {
  const ok = await tryToLockCourtCase(dataSource, courtCaseId, currentUser.username)
  if (!ok) {
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
