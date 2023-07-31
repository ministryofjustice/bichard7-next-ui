import { EntityManager, IsNull } from "typeorm"
import CourtCase from "../entities/CourtCase"
import { isError } from "../../types/Result"
import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import { default as TriggerEntity } from "../entities/Trigger"

const updateTriggers = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  triggersToAdd: Trigger[],
  triggersToDelete: Trigger[]
): Promise<Error | void> => {
  if (triggersToAdd.length > 0) {
    const addTriggersResult = await entityManager
      .getRepository(TriggerEntity)
      .insert(
        triggersToAdd.map((triggerToAdd) => ({
          triggerCode: triggerToAdd.code,
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
      entityManager.getRepository(TriggerEntity).delete({
        errorId: courtCase.errorId,
        triggerCode: triggerToDelete.code,
        status: "Unresolved",
        triggerItemIdentity: triggerToDelete.offenceSequenceNumber ?? IsNull()
      })
    )
  ).catch((error) => error)
}

export default updateTriggers
