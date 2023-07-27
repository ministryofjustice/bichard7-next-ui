import { DataSource, EntityManager, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import amendCourtCase from "../amendCourtCase"
import User from "../entities/User"
import insertNotes from "../insertNotes"
import updateLockStatusToUnlocked from "../updateLockStatusToUnlocked"
import UnlockReason from "types/UnlockReason"
import {
  AuditLogEvent,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import storeAuditLogEvents from "../storeAuditLogEvents"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import { AUDIT_LOG_EVENT_SOURCE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import getCourtCaseByOrganisationUnit from "../getCourtCaseByOrganisationUnit"
import { parseAhoXml } from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml"
import generateTriggers from "@moj-bichard7-developers/bichard7-next-core/dist/triggers/generate"
import type { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import Phase from "@moj-bichard7-developers/bichard7-next-core/dist/types/Phase"
import filterExcludedTriggers from "@moj-bichard7-developers/bichard7-next-core/dist/triggers/filterExcludedTriggers"
import recalculateTriggers from "./recalculateTriggers"
import updateCourtCase from "./updateCourtCase"
import updateTriggers from "./updateTriggers"

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
): Promise<UpdateResult | Error> => {
  return dataSource
    .transaction("SERIALIZABLE", async (entityManager): Promise<UpdateResult | Error> => {
      const events: AuditLogEvent[] = []

      const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

      if (isError(courtCase)) {
        throw courtCase
      }

      if (!courtCase) {
        throw new Error("Failed to reallocate: Case not found")
      }

      const aho = parseAhoXml(courtCase.hearingOutcome)

      if (isError(aho)) {
        return aho
      }

      const preUpdateTrigger = generateTriggers(aho)
      const postUpdateTriggers: Trigger[] = []
      const isCaseRecordableOnPnc = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
      if (
        courtCase.phase === Phase.PNC_UPDATE &&
        isCaseRecordableOnPnc &&
        (!courtCase.errorStatus || courtCase.errorStatus === "Resolved")
      ) {
        //TODO: Update this when post triggers generation logic is implemented in core
        throw Error("Logic to generate post update triggers is not implemented")
      }

      let triggers = preUpdateTrigger.concat(postUpdateTriggers)

      if (!courtCase.errorStatus || courtCase.errorStatus === "Resolved") {
        triggers = filterExcludedTriggers(aho, [...triggers, { code: REALLOCATE_CASE_TRIGGER_CODE }])
      }

      const { triggersToAdd, triggersToDelete } = recalculateTriggers(courtCase, triggers)

      const updateTriggersResult = await updateTriggers(triggersToAdd, entityManager, courtCase, triggersToDelete)

      if (isError(updateTriggersResult)) {
        throw updateTriggersResult
      }

      const amendResult = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCase, user)

      if (isError(amendResult)) {
        throw amendResult
      }

      const newForceCode = amendResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode

      const updateCourtCaseResult = await updateCourtCase(
        entityManager,
        courtCase,
        amendResult,
        triggersToAdd.length > 0 || triggersToDelete.length > 0
      )

      if (isError(updateCourtCaseResult)) {
        throw updateCourtCaseResult
      }

      const addNoteResult = await insertNotes(entityManager, [
        {
          noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}`,
          errorId: courtCaseId,
          userId: "System"
        }
      ])

      if (isError(addNoteResult)) {
        throw addNoteResult
      }

      if (note) {
        const addUserNoteResult = await insertNotes(entityManager, [
          {
            noteText: note,
            errorId: courtCaseId,
            userId: user.username
          }
        ])

        if (isError(addUserNoteResult)) {
          throw addUserNoteResult
        }
      }

      events.push(
        getAuditLogEvent(
          AuditLogEventOptions.hearingOutcomeReallocated,
          EventCategory.information,
          AUDIT_LOG_EVENT_SOURCE,
          {
            user: user.username,
            auditLogVersion: 2,
            "New Force Owner": `${newForceCode}`
          }
        )
      )

      const unlockResult = await updateLockStatusToUnlocked(
        entityManager,
        courtCase,
        user,
        UnlockReason.TriggerAndException,
        events
      )

      if (isError(unlockResult)) {
        throw unlockResult
      }

      const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events).catch((error) => error)

      if (isError(storeAuditLogResponse)) {
        throw storeAuditLogResponse
      }

      return unlockResult
    })
    .catch((error) => error)
}

export default reallocateCourtCaseToForce
