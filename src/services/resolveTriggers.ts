import { DataSource, In, IsNull } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { includes } from "lodash"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { KeyValuePair } from "types/KeyValuePair"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

const generateTriggersAttributes = (triggers: Trigger[]) =>
  triggers.reduce((acc, trigger, index) => {
    const offenceNumberText =
      trigger.triggerItemIdentity && trigger.triggerItemIdentity > 0 ? ` (${trigger.triggerItemIdentity})` : ""
    acc[`Trigger ${index + 1} Details`] = `${trigger.triggerCode}${offenceNumberText}`
    return acc
  }, {} as KeyValuePair<string, unknown>)

// Returns back whether the triggers were successfully unlocked
const resolveTriggers = async (
  dataSource: DataSource,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): PromiseResult<boolean> => {
  const resolver = user.username

  return dataSource
    .transaction("SERIALIZABLE", async (entityManager) => {
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

      if (remainingUnresolvedTriggers !== 0) {
        return true
      }

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

      const result = updateCaseResult.affected && updateCaseResult.affected > 0

      if (!result) {
        return false
      }

      const events: AuditLogEvent[] = []

      events.push(
        getAuditLogEvent("information", "Trigger marked as resolved by user", "Bichard New UI", {
          user: user.username,
          auditLogVersion: 2,
          eventCode: "triggers.resolved",
          "Number Of Triggers": triggerIds.length,
          ...generateTriggersAttributes(courtCase.triggers.filter((trigger) => triggerIds.includes(trigger.triggerId)))
        })
      )

      const allTriggers = await entityManager.getRepository(Trigger).find({ where: { errorId: courtCaseId } })

      if (isError(allTriggers)) {
        throw allTriggers
      }

      const numberOfResolvedTriggers = allTriggers.filter((trigger) => trigger.resolvedAt).length

      if (numberOfResolvedTriggers === allTriggers.length) {
        events.push(
          getAuditLogEvent("information", "All triggers marked as resolved", "Bichard New UI", {
            user: user.username,
            auditLogVersion: 2,
            eventCode: "triggers.all-resolved",
            "Number Of Triggers": allTriggers.length,
            ...generateTriggersAttributes(allTriggers)
          })
        )
      }

      const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events)

      if (isError(storeAuditLogResponse)) {
        throw storeAuditLogResponse
      }

      return true
    })
    .catch((error) => error)
}

export default resolveTriggers
