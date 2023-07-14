import { DataSource, In, IsNull, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import {
  AuditLogEventOptions,
  type AuditLogEvent
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import UnlockReason from "../types/UnlockReason"

const generateTriggersAttributes = (triggers: Trigger[]) =>
  triggers.reduce((acc, trigger, index) => {
    const offenceNumberText =
      trigger.triggerItemIdentity && trigger.triggerItemIdentity > 0 ? ` (${trigger.triggerItemIdentity})` : ""
    acc[`Trigger ${index + 1} Details`] = `${trigger.triggerCode}${offenceNumberText}`
    return acc
  }, {} as KeyValuePair<string, unknown>)

const resolveTriggers = async (
  dataSource: DataSource,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  const resolver = user.username

  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw Error("Court case not found")
    }

    const areAnyTriggersResolved =
      courtCase.triggers.some((trigger) => triggerIds.includes(trigger.triggerId) && !!trigger.resolvedAt) ?? false
    if (areAnyTriggersResolved) {
      throw Error("One or more triggers are already resolved")
    }

    if (courtCase === null) {
      throw Error("Could not find the court case")
    }

    if (!courtCase.triggersAreLockedByCurrentUser(resolver)) {
      throw Error("Triggers are not locked by the user")
    }

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

    if (updateTriggersResult.affected && updateTriggersResult.affected !== triggerIds.length) {
      throw Error("Failed to resolve triggers")
    }

    const events: AuditLogEvent[] = []

    events.push(
      getAuditLogEvent(AuditLogEventOptions.triggerResolved, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
        user: user.username,
        auditLogVersion: 2,
        "Number Of Triggers": triggerIds.length,
        ...generateTriggersAttributes(courtCase.triggers.filter((trigger) => triggerIds.includes(trigger.triggerId)))
      })
    )

    const allTriggers = await entityManager.getRepository(Trigger).find({ where: { errorId: courtCaseId } })
    if (isError(allTriggers)) {
      throw allTriggers
    }

    const areAllTriggersResolved = allTriggers.filter((trigger) => trigger.resolvedAt).length === allTriggers.length

    if (areAllTriggersResolved) {
      const updateCaseResult = await entityManager
        .getRepository(CourtCase)
        .update(
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
        .catch((error) => error)

      if (isError(updateCaseResult)) {
        throw updateCaseResult
      }

      if (!updateCaseResult.affected || updateCaseResult.affected === 0) {
        throw Error("Failed to update court case")
      }

      events.push(
        getAuditLogEvent(AuditLogEventOptions.allTriggersResolved, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
          user: user.username,
          auditLogVersion: 2,
          "Number Of Triggers": allTriggers.length,
          ...generateTriggersAttributes(allTriggers)
        })
      )

      const unlockResult = await updateLockStatusToUnlocked(
        entityManager,
        courtCase,
        user,
        UnlockReason.Trigger,
        events
      )

      if (isError(unlockResult)) {
        throw unlockResult
      }
    }

    const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return updateTriggersResult
  })
}

export default resolveTriggers
