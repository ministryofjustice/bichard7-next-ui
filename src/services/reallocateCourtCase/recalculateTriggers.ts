import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import CourtCase from "../entities/CourtCase"
import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import { default as TriggerEntity } from "../entities/Trigger"

const hasTrigger = (triggers: Trigger[] | TriggerEntity[], trigger: Trigger | TriggerEntity): boolean => {
  const code = "code" in trigger ? trigger.code : trigger.triggerCode
  const offenceSequenceNumber =
    ("code" in trigger ? trigger.offenceSequenceNumber : trigger.triggerItemIdentity) || undefined

  return triggers.some((existingTrigger) =>
    "triggerCode" in existingTrigger
      ? existingTrigger.triggerCode === code &&
        (existingTrigger.triggerItemIdentity || undefined) === offenceSequenceNumber
      : existingTrigger.code === code && (existingTrigger.offenceSequenceNumber || undefined) === offenceSequenceNumber
  )
}

const recalculateTriggers = (
  courtCase: CourtCase,
  triggers: Trigger[]
): { triggersToAdd: Trigger[]; triggersToDelete: Trigger[] } => {
  const existingTriggers = courtCase.triggers
  let totalUnresolvedTriggers = existingTriggers.length + triggers.length

  const foundUnresolvedReallocatedTrigger = existingTriggers.some(
    (trigger) => trigger.triggerCode === REALLOCATE_CASE_TRIGGER_CODE && trigger.status === "Unresolved"
  )
  const existingReallocatedTrigger = existingTriggers.find(
    (trigger) => trigger.triggerCode === REALLOCATE_CASE_TRIGGER_CODE
  )
  const newReallocatedTrigger = triggers.find((trigger) => trigger.code === REALLOCATE_CASE_TRIGGER_CODE)
  const reallocatedTrigger: Trigger | undefined = existingReallocatedTrigger
    ? ({
        code: existingReallocatedTrigger.triggerCode,
        offenceSequenceNumber: existingReallocatedTrigger.triggerItemIdentity
      } as Trigger)
    : newReallocatedTrigger

  const foundUnresolvedOutOfAreaTrigger = existingTriggers.some(
    (trigger) => trigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE && trigger.status === "Unresolved"
  )
  const existingOutOfAreaTrigger = existingTriggers.find((trigger) => trigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE)
  const newOutOfAreaTrigger = triggers.find((trigger) => trigger.code === OUT_OF_AREA_TRIGGER_CODE)
  const outOfAreaTrigger: Trigger | undefined = existingOutOfAreaTrigger
    ? ({ code: existingOutOfAreaTrigger.triggerCode } as Trigger)
    : newOutOfAreaTrigger

  const resolvedTriggers = existingTriggers.filter((trigger) => trigger.status === "Resolved")
  const foundResolvedOutOfAreaTrigger = hasTrigger(resolvedTriggers, { code: OUT_OF_AREA_TRIGGER_CODE })
  totalUnresolvedTriggers -= existingTriggers.filter((existingTrigger) => existingTrigger.status === "Resolved").length

  let triggersToDelete: Trigger[] = existingTriggers
    .filter((existingTrigger) => !hasTrigger(triggers, existingTrigger))
    .map(
      (trigger) =>
        ({
          code: trigger.triggerCode,
          offenceSequenceNumber: trigger.triggerItemIdentity
        }) as Trigger
    )

  let triggersToAdd: Trigger[] = (
    existingTriggers.length === 0
      ? triggers
      : triggers.filter(
          (trigger) =>
            (trigger.code === OUT_OF_AREA_TRIGGER_CODE &&
              foundResolvedOutOfAreaTrigger &&
              !foundUnresolvedOutOfAreaTrigger) ||
            !hasTrigger(existingTriggers, trigger)
        )
  ).map((trigger) => ({
    code: trigger.code,
    offenceSequenceNumber: trigger.offenceSequenceNumber
  }))

  totalUnresolvedTriggers -=
    triggersToDelete.length + existingTriggers.filter((existingTrigger) => hasTrigger(triggers, existingTrigger)).length

  if (totalUnresolvedTriggers <= 0 && reallocatedTrigger && triggersToAdd.length === 0) {
    if (foundUnresolvedReallocatedTrigger) {
      triggersToDelete = triggersToDelete.filter(
        (triggerToDelete) => triggerToDelete.code !== REALLOCATE_CASE_TRIGGER_CODE
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
      hasTrigger(existingTriggers, reallocatedTrigger) &&
      !hasTrigger(triggersToDelete, reallocatedTrigger)
    ) {
      triggersToDelete.push(reallocatedTrigger)
    } else if (reallocatedTrigger && hasTrigger(triggersToAdd, reallocatedTrigger)) {
      triggersToAdd = triggersToAdd.filter((trigger) => trigger.code !== REALLOCATE_CASE_TRIGGER_CODE)
    }
  }

  if (triggersToAdd.length > 0 && totalUnresolvedTriggers == 2 && outOfAreaTrigger && reallocatedTrigger) {
    if (hasTrigger(triggersToAdd, outOfAreaTrigger)) {
      triggersToAdd = triggersToAdd.filter((triggerToAdd) => triggerToAdd.code === OUT_OF_AREA_TRIGGER_CODE)
    } else if (!hasTrigger(triggersToDelete, { code: OUT_OF_AREA_TRIGGER_CODE })) {
      triggersToDelete.push(outOfAreaTrigger)
    }

    if (
      hasTrigger(existingTriggers, { code: REALLOCATE_CASE_TRIGGER_CODE }) &&
      !hasTrigger(triggersToDelete, { code: REALLOCATE_CASE_TRIGGER_CODE })
    ) {
      triggersToDelete = triggersToDelete.filter((trigger) => trigger.code === REALLOCATE_CASE_TRIGGER_CODE)
    }
  }

  return { triggersToAdd, triggersToDelete }
}

export default recalculateTriggers
