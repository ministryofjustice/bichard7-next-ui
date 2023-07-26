import { EntityManager, IsNull } from "typeorm"
import TriggerOutcome from "../../types/TriggerOutcome"
import CourtCase from "../entities/CourtCase"
import { isError } from "../../types/Result"
import Trigger from "../entities/Trigger"

const updateTriggers = async (
  triggersToAdd: TriggerOutcome[],
  entityManager: EntityManager,
  courtCase: CourtCase,
  triggersToDelete: TriggerOutcome[]
): Promise<Error | void> => {
  if (triggersToAdd.length > 0) {
    const addTriggersResult = await entityManager
      .getRepository(Trigger)
      .insert(
        triggersToAdd.map((triggerToAdd) => ({
          triggerCode: triggerToAdd.triggerCode,
          triggerItemIdentity: triggerToAdd.offenceSequenceNumber,
          status: "Unresolved",
          createdAt: new Date(),
          errorId: courtCase.errorId
        }))
      )
      .catch((error) => error)

    if (isError(addTriggersResult)) {
      return addTriggersResult
    }
  }

  return Promise.all(
    triggersToDelete.map((triggerToDelete) =>
      entityManager.getRepository(Trigger).delete({
        errorId: courtCase.errorId,
        triggerCode: triggerToDelete.triggerCode,
        status: "Unresolved",
        triggerItemIdentity: triggerToDelete.offenceSequenceNumber ?? IsNull()
      })
    )
  ).catch((error) => error)
}

export default updateTriggers
