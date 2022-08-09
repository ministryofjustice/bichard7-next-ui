import { isError } from "cypress/types/lodash"
import { DataSource } from "typeorm"
import PromiseResult from "types/PromiseResult"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import getCourtCase from "./getCourtCase"
import lockCourtCase from "./lockCourtCase"

const NotFoundError = "Court case not found"

export const lockWhileFetchingCourtCase = async (currentUser: User, courtCaseId: string, dataSource: DataSource): PromiseResult<{courtCase: CourtCase, notFound: boolean}> => {
  const courtCase = await dataSource.transaction("SERIALIZABLE", async (transactionalEntityManager) => {
    const fetchedCourtCase = await getCourtCase(
      transactionalEntityManager,
      parseInt(courtCaseId, 10),
      currentUser.visibleForces
    )

    if (!fetchedCourtCase) {
      return new Error(NotFoundError)
    }

    if (isError(fetchedCourtCase)) {
      console.error(fetchedCourtCase)
      throw fetchedCourtCase
    }

    // If we fail to lock the record because someone else has already locked it since the original fetch,
    // fetch the newer data and return that
    return lockCourtCase(transactionalEntityManager, fetchedCourtCase, currentUser.username).then(
      (lockedCourtCase) => lockedCourtCase,
      (error) => {
        console.error(error)
        // TODO this doesn't really work, it just returns an error for courtCase instead of the updated court case
        return getCourtCase(transactionalEntityManager, parseInt(courtCaseId, 10), currentUser.visibleForces)
      }
    )
  })

}

    if ((isError(courtCase) && courtCase.message === NotFoundError) || courtCase === null) {
      return {
        notFound: true
      }
    } else if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCase.serialize()
      }
    }
  }
)
