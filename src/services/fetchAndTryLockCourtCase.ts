import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import getCourtCase from "./getCourtCase"
import tryToLockCourtCase from "./tryToLockCourtCase"

type fetchAndTryLockCourtCaseResult = { courtCase?: CourtCase; notFound?: boolean; lockAcquireFailed?: boolean }

const fetchAndTryLockCourtCase = async (
  currentUser: User,
  courtCaseId: number,
  dataSource: DataSource
): Promise<fetchAndTryLockCourtCaseResult> => {
  const ok = await tryToLockCourtCase(dataSource, courtCaseId, currentUser.username)
  if (!ok) {
    return {
      lockAcquireFailed: true
    }
  }

  const courtCase = await getCourtCase(dataSource, courtCaseId, currentUser.visibleForces)
  if (!courtCase) {
    return {
      notFound: true
    }
  }
  if (isError(courtCase)) {
    console.error(courtCase.message)
    throw courtCase
  }

  // If the current user doesn't hold the locks
  if (courtCase.errorLockedById !== currentUser.username || courtCase.triggerLockedById !== currentUser.username) {
    return {
      courtCase,
      lockAcquireFailed: true
    }
  } else {
    return {
      courtCase
    }
  }
}

// const fetchAndTryLockCourtCase = async (
//   currentUser: User,
//   courtCaseId: string,
//   dataSource: DataSource
// ): Promise<fetchAndTryLockCourtCaseResult> => {
//   const transactionResult: fetchAndTryLockCourtCaseResult = await dataSource.transaction(
//     "SERIALIZABLE",
//     async (transactionalEntityManager) => {
//       const fetchedCourtCase = await getCourtCase(
//         transactionalEntityManager,
//         parseInt(courtCaseId, 10),
//         currentUser.visibleForces
//       )

//       if (!fetchedCourtCase) {
//         return {
//           notFound: true
//         }
//       }

//       if (isError(fetchedCourtCase)) {
//         console.error(fetchedCourtCase.message)
//         throw fetchedCourtCase
//       }

//       try {
//         const lockedCourtCaseResult = await lockCourtCase(
//           transactionalEntityManager,
//           fetchedCourtCase,
//           currentUser.username
//         )

//         if (isError(lockedCourtCaseResult)) {
//           console.error(lockedCourtCaseResult)

//           return {
//             lockAcquireFailed: true
//           }
//         }

//         return {
//           courtCase: lockedCourtCaseResult
//         }
//       } catch (error) {
//         console.error("Failed to lock court case")
//         return {
//           notFound: true
//         }
//       }
//     }
//   )

//   if (transactionResult.lockAcquireFailed) {
//     const courtCaseResult = await getCourtCase(dataSource, parseInt(courtCaseId, 10), currentUser.visibleForces)

//     if (isError(courtCaseResult)) {
//       console.error(courtCaseResult.message)
//       throw courtCaseResult
//     }

//     if (!courtCaseResult) {
//       return {
//         notFound: true
//       }
//     }

//     return {
//       courtCase: courtCaseResult
//     }
//   }

//   return transactionResult
// }

export type { fetchAndTryLockCourtCaseResult }
export { fetchAndTryLockCourtCase }
