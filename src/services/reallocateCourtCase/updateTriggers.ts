import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import {
  AuditLogEvent,
  AuditLogEventOption,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import { EntityManager, IsNull } from "typeorm"
import { AUDIT_LOG_EVENT_SOURCE } from "../../config"
import { isError } from "../../types/Result"
import CourtCase from "../entities/CourtCase"
import { default as TriggerEntity } from "../entities/Trigger"
import User from "../entities/User"

const getTriggersDetails = (triggers: Trigger[]) =>
  triggers.reduce((acc: Record<string, unknown>, trigger, index) => {
    acc[`Trigger ${index + 1} Details`] = trigger.code
    return acc
  }, {})

const generateEvent = (option: AuditLogEventOption, triggers: Trigger[], user: User, hasUnresolvedException: boolean) =>
  getAuditLogEvent(option, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
    user: user.username,
    auditLogVersion: 2,
    "Trigger and Exception Flag": hasUnresolvedException,
    "Number of Triggers": triggers.length,
    ...getTriggersDetails(triggers)
  })

const updateTriggers = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  triggersToAdd: Trigger[],
  triggersToDelete: Trigger[],
  hasUnresolvedException: boolean,
  user: User,
  events: AuditLogEvent[]
): Promise<Error | void> => {
  const generatedEvents: AuditLogEvent[] = []

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

    generatedEvents.push(
      generateEvent(AuditLogEventOptions.triggerGenerated, triggersToAdd, user, hasUnresolvedException)
    )
  }

  if (triggersToDelete.length > 0) {
    const deleteTriggersResult = await Promise.all(
      triggersToDelete.map((triggerToDelete) =>
        entityManager.getRepository(TriggerEntity).delete({
          errorId: courtCase.errorId,
          triggerCode: triggerToDelete.code,
          status: "Unresolved",
          triggerItemIdentity: triggerToDelete.offenceSequenceNumber ?? IsNull()
        })
      )
    ).catch((error) => error)

    if (isError(deleteTriggersResult)) {
      return deleteTriggersResult
    }

    generatedEvents.push(
      generateEvent(AuditLogEventOptions.triggerDeleted, triggersToDelete, user, hasUnresolvedException)
    )
  }

  generatedEvents.forEach((event) => events.push(event))
}

export default updateTriggers
