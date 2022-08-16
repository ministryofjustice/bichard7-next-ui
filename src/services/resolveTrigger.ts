import { DataSource, IsNull } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import getCourtCase from "./getCourtCase"

// Returns back whether the trigger was successfully unlocked
const resolveTrigger = async (
  dataSource: DataSource,
  triggerId: number,
  courtCaseId: number,
  resolver: string,
  visibleForces: string[]
): PromiseResult<boolean> => {
  try {
    return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
      const courtCase = await getCourtCase(entityManager, courtCaseId, visibleForces)

      if (isError(courtCase)) {
        throw courtCase
      }

      if (courtCase === null) {
        return false
      }

      if (courtCase.isLockedByAnotherUser(resolver)) {
        return false
      }

      const remainingUnresolvedTriggers = courtCase.triggers.filter(
        (trigger) => !trigger.resolvedAt && !trigger.resolvedBy && trigger.triggerId !== triggerId
      ).length

      const updateTriggerResult = await entityManager.getRepository(Trigger).update(
        {
          triggerId,
          resolvedAt: IsNull(),
          resolvedBy: IsNull()
        },
        {
          resolvedAt: new Date(),
          resolvedBy: resolver,
          status: "Resolved"
        }
      )

      const updateTriggerSuccess = updateTriggerResult.affected !== undefined && updateTriggerResult.affected > 0
      if (!updateTriggerSuccess) {
        return updateTriggerSuccess
      }

      if (remainingUnresolvedTriggers === 0) {
        const updateCaseResult = await entityManager.getRepository(CourtCase).update(
          {
            errorId: courtCaseId,
            triggerResolvedBy: IsNull(),
            triggerResolvedTimestamp: IsNull()
          },
          { triggerResolvedBy: resolver, triggerResolvedTimestamp: new Date(), triggerStatus: "Resolved" }
        )

        return updateCaseResult.affected !== undefined && updateCaseResult.affected > 0
      } else {
        return true
      }
    })
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when marking trigger ${triggerId} as resolved by ${resolver}`)
  }
}

export default resolveTrigger
