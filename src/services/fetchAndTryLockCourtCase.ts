import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import getCourtCase from "./getCourtCase"
import lockCourtCase from "./lockCourtCase"

type fetchAndTryLockCourtCaseResult = { courtCase?: CourtCase; notFound?: boolean; lockAcquireFailed?: boolean }

const fetchAndTryLockCourtCase = async (
  currentUser: User,
  courtCaseId: string,
  dataSource: DataSource
): Promise<fetchAndTryLockCourtCaseResult> => {
  const transactionResult: fetchAndTryLockCourtCaseResult = await dataSource.transaction(
    "SERIALIZABLE",
    async (transactionalEntityManager) => {
      const fetchedCourtCase = await getCourtCase(
        transactionalEntityManager,
        parseInt(courtCaseId, 10),
        currentUser.visibleForces
      )

      if (!fetchedCourtCase) {
        return {
          notFound: true
        }
      }

      if (isError(fetchedCourtCase)) {
        console.error(fetchedCourtCase.message)
        throw fetchedCourtCase
      }

      try {
        const lockedCourtCaseResult = await lockCourtCase(
          transactionalEntityManager,
          fetchedCourtCase,
          currentUser.username
        )

        if (isError(lockedCourtCaseResult)) {
          console.error(lockedCourtCaseResult)

          return {
            lockAcquireFailed: true
          }
        }

        return {
          courtCase: lockedCourtCaseResult
        }
      } catch (error) {
        console.error("Failed to lock court case")
        return {
          notFound: true
        }
      }
    }
  )

  if (transactionResult.lockAcquireFailed) {
    const courtCaseResult = await getCourtCase(dataSource, parseInt(courtCaseId, 10), currentUser.visibleForces)

    if (isError(courtCaseResult)) {
      console.error(courtCaseResult.message)
      throw courtCaseResult
    }

    if (!courtCaseResult) {
      return {
        notFound: true
      }
    }

    return {
      courtCase: courtCaseResult
    }
  }

  return transactionResult
}

export type { fetchAndTryLockCourtCaseResult }
export { fetchAndTryLockCourtCase }
