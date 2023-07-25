import { DataSource, EntityManager, IsNull, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import UnlockReason from "types/UnlockReason"
import {
  AuditLogEvent,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { parseAhoXml } from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml"
import generateTriggers from "@moj-bichard7-developers/bichard7-next-core/dist/triggers/generate"
import type { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import Phase from "@moj-bichard7-developers/bichard7-next-core/dist/types/Phase"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import { TriggerCode } from "@moj-bichard7-developers/bichard7-next-core/dist/types/TriggerCode"
import filterExcludedTriggers from "@moj-bichard7-developers/bichard7-next-core/dist/triggers/filterExcludedTriggers"
import { default as TriggerEntity } from "./entities/Trigger"

const reallocateCaseTriggerCode = "TRPR0028" as TriggerCode
const outOfAreaTriggerCode = TriggerCode.TRPR0027

type TriggerOutcome = { triggerCode: string; offenceSequenceNumber?: number }

const recalculateTriggers = (courtCase: CourtCase, triggers: Trigger[]) => {
  const existingTriggers = courtCase.triggers
  let totalUnresolvedTriggers = existingTriggers.length + triggers.length

  const foundUnresolvedReallocatedTrigger = existingTriggers.some(
    (trigger) => trigger.triggerCode === reallocateCaseTriggerCode && trigger.status === "Unresolved"
  )
  const existingReallocatedTrigger = existingTriggers.find(
    (trigger) => trigger.triggerCode === reallocateCaseTriggerCode
  )
  const newReallocatedTrigger = triggers.find((trigger) => trigger.code === reallocateCaseTriggerCode)
  const reallocatedTrigger: TriggerOutcome | undefined = existingReallocatedTrigger
    ? { triggerCode: existingReallocatedTrigger.triggerCode }
    : newReallocatedTrigger
    ? { triggerCode: newReallocatedTrigger.code.toString() }
    : undefined

  const foundUnresolvedOutOfAreaTrigger = existingTriggers.some(
    (trigger) => trigger.triggerCode === outOfAreaTriggerCode && trigger.status === "Unresolved"
  )
  const existingOutOfAreaTrigger = existingTriggers.find((trigger) => trigger.triggerCode === outOfAreaTriggerCode)
  const newOutOfAreaTrigger = triggers.find((trigger) => trigger.code === outOfAreaTriggerCode)
  const outOfAreaTrigger: TriggerOutcome | undefined = existingOutOfAreaTrigger
    ? { triggerCode: existingOutOfAreaTrigger.triggerCode }
    : newOutOfAreaTrigger
    ? { triggerCode: newOutOfAreaTrigger.code.toString() }
    : undefined

  const resolvedTriggers = existingTriggers.filter((trigger) => trigger.status === "Resolved")
  const foundResolvedOutOfAreaTrigger = resolvedTriggers.some((trigger) => trigger.triggerCode === outOfAreaTriggerCode)
  totalUnresolvedTriggers -= existingTriggers.filter((existingTrigger) => existingTrigger.status === "Resolved").length

  let triggersToDelete: TriggerOutcome[] = existingTriggers
    .filter((existingTrigger) => !triggers.some((trigger) => trigger.code === existingTrigger.triggerCode))
    .map((trigger) => ({
      triggerCode: trigger.triggerCode,
      offenceSequenceNumber: trigger.triggerItemIdentity,
      triggerId: trigger.triggerId
    }))

  let triggersToAdd: TriggerOutcome[] = (
    existingTriggers.length === 0
      ? triggers
      : triggers.filter(
          (trigger) =>
            (trigger.code === outOfAreaTriggerCode &&
              foundResolvedOutOfAreaTrigger &&
              !foundUnresolvedOutOfAreaTrigger) ||
            !existingTriggers.some((existingTrigger) => existingTrigger.triggerCode === trigger.code)
        )
  ).map((trigger) => ({
    triggerCode: trigger.code,
    offenceSequenceNumber: trigger.offenceSequenceNumber,
    triggerId: undefined
  }))

  totalUnresolvedTriggers -=
    triggersToDelete.length +
    existingTriggers.filter((existingTrigger) =>
      triggers.some((trigger) => trigger.code === existingTrigger.triggerCode)
    ).length

  if (totalUnresolvedTriggers === 0 && reallocatedTrigger && triggersToAdd.length === 0) {
    if (foundUnresolvedReallocatedTrigger) {
      triggersToDelete = triggersToDelete.filter(
        (triggerToDelete) => triggerToDelete.triggerCode === reallocateCaseTriggerCode
      )
    } else {
      triggersToAdd.push(reallocatedTrigger)
    }
  }

  if (
    triggersToAdd.length > 0 &&
    (totalUnresolvedTriggers > 2 || (totalUnresolvedTriggers === 2 && !outOfAreaTrigger && reallocatedTrigger))
  ) {
    if (
      reallocatedTrigger &&
      existingTriggers.some(
        (existingTrigger) =>
          existingTrigger.triggerCode === reallocatedTrigger.triggerCode &&
          existingTrigger.triggerItemIdentity === reallocatedTrigger.offenceSequenceNumber
      ) &&
      !triggersToDelete.some((triggerToDelete) => triggerToDelete.triggerCode === reallocatedTrigger?.triggerCode)
    ) {
      triggersToDelete.push(reallocatedTrigger)
    } else if (
      reallocatedTrigger &&
      triggersToAdd.some((triggerToAdd) => triggerToAdd.triggerCode === reallocatedTrigger.triggerCode)
    ) {
      triggersToAdd = triggersToAdd.filter((trigger) => trigger.triggerCode === reallocateCaseTriggerCode)
    }
  }

  if (triggersToAdd.length > 0 && totalUnresolvedTriggers == 2 && outOfAreaTrigger && reallocatedTrigger) {
    if (triggersToAdd.some((triggerToAdd) => triggerToAdd.triggerCode === outOfAreaTrigger.triggerCode)) {
      triggersToAdd = triggersToAdd.filter((triggerToAdd) => triggerToAdd.triggerCode === outOfAreaTriggerCode)
    } else {
      triggersToDelete.push(outOfAreaTrigger)
    }

    if (
      existingTriggers.some((existingTrigger) => existingTrigger.triggerCode === reallocateCaseTriggerCode) &&
      !triggersToDelete.some((triggerToDelete) => triggerToDelete.triggerCode === reallocateCaseTriggerCode)
    ) {
      triggersToDelete = triggersToDelete.filter((trigger) => trigger.triggerCode === reallocateCaseTriggerCode)
    }
  }

  return { triggersToAdd, triggersToDelete }
}

const updateCourtCase = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  aho: AnnotatedHearingOutcome,
  addedTriggers: TriggerOutcome[],
  deletedTriggers: TriggerOutcome[]
): Promise<Pick<CourtCase, "orgForPoliceFilter"> | Error> => {
  const triggerTimestamp = new Date()
  const triggers = await entityManager
    .getRepository(TriggerEntity)
    .findBy({ errorId: courtCase.errorId })
    .catch((error) => error as Error)

  if (isError(triggers)) {
    throw triggers
  }

  const asnSize = 21
  const ptiurnSize = 11
  const { SecondLevelCode, ThirdLevelCode } = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner ?? {}
  const orgForPoliceFilter = `${SecondLevelCode}${ThirdLevelCode !== "00" ? ThirdLevelCode : ""}`
  const courtCaseUpdateQuery = entityManager.createQueryBuilder().update<CourtCase>(CourtCase)
  courtCaseUpdateQuery.set({
    triggerCount: triggers.length,
    asn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber.substring(0, asnSize),
    ptiurn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN.substring(0, ptiurnSize),
    orgForPoliceFilter
  })

  if (addedTriggers.length > 0 || deletedTriggers.length > 0) {
    if (triggers.length === 0) {
      courtCaseUpdateQuery.set({
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerReason: null,
        triggerStatus: null,
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerQualityChecked: null,
        triggerInsertedTimestamp: null
      })
    } else if (triggers.every((trigger) => trigger.status === "Resolved")) {
      courtCaseUpdateQuery.set({
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerStatus: "Resolved",
        triggerResolvedBy: "System",
        triggerResolvedTimestamp: triggerTimestamp,
        triggerQualityChecked: 1 //Unchecked - TODO: Refactor to use enum/type
      })
    } else if (triggers.some((trigger) => trigger.status === "Resolved")) {
      courtCaseUpdateQuery.set({
        resolutionTimestamp: null,
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerStatus: "Unresolved",
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerQualityChecked: 1, //Unchecked - TODO: Refactor to use enum/type
        triggerInsertedTimestamp: triggerTimestamp
      })
    }
  }

  const updateResult = await courtCaseUpdateQuery.execute().catch((error) => error as Error)
  if (isError(updateResult)) {
    return updateResult
  }

  if (!updateResult.affected || updateResult.affected === 0) {
    return Error("Couldn't update the court case")
  }

  return { orgForPoliceFilter }
}

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
        triggers.push({ code: reallocateCaseTriggerCode })
        triggers = filterExcludedTriggers(aho, [...triggers, { code: reallocateCaseTriggerCode }])
      }

      const { triggersToAdd, triggersToDelete } = recalculateTriggers(courtCase, triggers)

      if (triggersToAdd.length > 0) {
        const addTriggersResult = await entityManager
          .getRepository(TriggerEntity)
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
          throw addTriggersResult
        }
      }

      const deleteTriggersResult = await Promise.all(
        triggersToDelete.map((triggerToDelete) =>
          entityManager.getRepository(TriggerEntity).delete({
            errorId: courtCase.errorId,
            triggerCode: triggerToDelete.triggerCode,
            status: "Unresolved",
            triggerItemIdentity: triggerToDelete.offenceSequenceNumber ?? IsNull()
          })
        )
      ).catch((error) => error)

      if (isError(deleteTriggersResult)) {
        throw deleteTriggersResult
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
        triggersToAdd,
        triggersToDelete
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
