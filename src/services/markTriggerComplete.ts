import { DataSource } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import Trigger from "./entities/Trigger"

// Returns back whether the trigger was successfully unlocked
const markTriggerComplete = async (
  dataSource: DataSource,
  trigger: Trigger,
  resolver: string
): PromiseResult<boolean> => {
  try {
    const result = await dataSource
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

    return result.affected !== undefined && result.affected > 0
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when marking trigger ${trigger.triggerId} as completed by ${resolver}`)
  }
}

export default markTriggerComplete
