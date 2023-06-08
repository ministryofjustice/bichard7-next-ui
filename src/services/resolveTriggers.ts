import { DataSource, In, IsNull } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { includes } from "lodash"

// Returns back whether the triggers were successfully unlocked
const resolveTriggers = async (
  dataSource: DataSource,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): PromiseResult<boolean> => {
  const resolver = user.username

  try {
    return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
      const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

      if (isError(courtCase)) {
        throw courtCase
      }

      if (courtCase === null) {
        return false
      }

      if (!courtCase.triggersAreLockedByCurrentUser(resolver)) {
        return false
      }

      const remainingUnresolvedTriggers = courtCase.triggers.filter(
        (trigger) => !trigger.resolvedAt && !trigger.resolvedBy && !includes(triggerIds, trigger.triggerId)
      ).length

      const updateTriggersResult = await entityManager.getRepository(Trigger).update(
        {
          triggerId: In(triggerIds),
          resolvedAt: IsNull(),
          resolvedBy: IsNull()
        },
        {
          resolvedAt: new Date(),
          resolvedBy: resolver,
          status: "Resolved"
        }
      )

      const updateTriggerSuccess =
        updateTriggersResult.affected !== undefined && updateTriggersResult.affected === triggerIds.length
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
          {
            triggerResolvedBy: resolver,
            resolutionTimestamp: new Date(),
            triggerResolvedTimestamp: new Date(),
            triggerStatus: "Resolved"
          }
        )

        return updateCaseResult.affected !== undefined && updateCaseResult.affected > 0
      } else {
        return true
      }
    })
  } catch (err) {
    return isError(err)
      ? err
      : new Error(
          `Unspecified database error when marking triggers ${triggerIds.join(", ")} as resolved by ${resolver}`
        )
  }
}

export default resolveTriggers
