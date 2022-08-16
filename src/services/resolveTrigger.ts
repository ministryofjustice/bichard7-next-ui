import { DataSource } from "typeorm"
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
      const lockHolderResult = await getCourtCase(entityManager, courtCaseId, visibleForces)

      if (isError(lockHolderResult)) {
        throw lockHolderResult
      }

      if (lockHolderResult === null) {
        return false
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lockHolder = lockHolderResult!.triggerLockedById

      if (lockHolder !== resolver) {
        return false
      }

      const remainingUnresolvedTriggers = lockHolderResult.triggers.filter(
        (trigger) => !trigger.resolvedAt && !trigger.resolvedBy && trigger.triggerId !== triggerId
      ).length

      const updateTriggerResult = await entityManager
        .createQueryBuilder()
        .update(Trigger)
        .set({
          resolvedAt: new Date(),
          resolvedBy: resolver,
          status: "Resolved"
        })
        .where("trigger_id = :triggerId", { triggerId })
        .andWhere("resolved_ts IS NULL")
        .andWhere("resolved_by IS NULL")
        .execute()

      const updateTriggerSuccess = updateTriggerResult.affected !== undefined && updateTriggerResult.affected > 0
      if (!updateTriggerSuccess) {
        return updateTriggerSuccess
      }

      if (remainingUnresolvedTriggers === 0) {
        const updateCaseResult = await entityManager
          .createQueryBuilder()
          .update(CourtCase)
          .set({ triggerResolvedBy: resolver, triggerResolvedTimestamp: new Date(), triggerStatus: "Resolved" })
          .where("error_id = :courtCaseId", { courtCaseId })
          .andWhere("trigger_resolved_by IS NULL")
          .andWhere("trigger_resolved_ts IS NULL")
          .execute()

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
