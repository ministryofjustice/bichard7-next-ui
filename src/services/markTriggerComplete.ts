import { DataSource } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"

// Returns back whether the trigger was successfully unlocked
const markTriggerComplete = async (
  dataSource: DataSource,
  trigger: Trigger,
  resolver: string
): PromiseResult<boolean> => {
  try {
    return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
      const lockHolderResult = await entityManager
        .getRepository(CourtCase)
        .createQueryBuilder()
        .where({ errorId: trigger.courtCase.errorId })
        .getOne()

      if (lockHolderResult === null) {
        return false
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lockHolder = lockHolderResult!.triggerLockedById

      if (lockHolder !== resolver) {
        return false
      }

      const updateResult = await entityManager
        .createQueryBuilder()
        .update(Trigger)
        .set({
          resolvedAt: new Date(),
          resolvedBy: resolver
        })
        .where("trigger_id = :triggerId", { triggerId: trigger.triggerId })
        .andWhere("resolved_ts IS NULL")
        .andWhere("resolved_by IS NULL")
        .execute()

      return updateResult.affected !== undefined && updateResult.affected > 0
    })
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when marking trigger ${trigger.triggerId} as completed by ${resolver}`)
  }
}

export default markTriggerComplete
