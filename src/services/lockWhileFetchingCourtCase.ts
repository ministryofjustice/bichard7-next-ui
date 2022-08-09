import { DataSource } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError, Result } from "types/Result"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import getCourtCase from "./getCourtCase"
import lockCourtCase from "./lockCourtCase"

type LockWhileFetchingCourtCaseResult = { courtCase?: CourtCase; notFound: boolean; lockAcquireFailed: boolean }

const lockWhileFetchingCourtCase = async (
  currentUser: User,
  courtCaseId: string,
  dataSource: DataSource
): PromiseResult<LockWhileFetchingCourtCaseResult> => {
  const transactionResult: Result<LockWhileFetchingCourtCaseResult> = await dataSource.transaction(
    "SERIALIZABLE",
    async (transactionalEntityManager) => {
      const fetchedCourtCase = await getCourtCase(
        transactionalEntityManager,
        parseInt(courtCaseId, 10),
        currentUser.visibleForces
      )

      if (!fetchedCourtCase) {
        return {
          courtCase: undefined,
          notFound: true,
          lockAcquireFailed: false
        }
      }

      if (isError(fetchedCourtCase)) {
        console.error(fetchedCourtCase)
        return fetchedCourtCase
      }

      try {
        const lockedCourtCaseResult = await lockCourtCase(
          transactionalEntityManager,
          fetchedCourtCase,
          currentUser.username
        )

        if (isError(lockedCourtCaseResult)) {
          console.error(lockedCourtCaseResult)
          return lockedCourtCaseResult
        }

        return {
          courtCase: lockedCourtCaseResult,
          notFound: false,
          lockAcquireFailed: false
        }
      } catch (error) {
        console.error("Failed to lock court case")
        return {
          notFound: false,
          lockAcquireFailed: true
        }
      }
    }
  )

  return transactionResult
}

export type { LockWhileFetchingCourtCaseResult }
export { lockWhileFetchingCourtCase }
