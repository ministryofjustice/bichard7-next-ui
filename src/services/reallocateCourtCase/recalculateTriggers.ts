import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import CourtCase from "../entities/CourtCase"
import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"

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
    ? ({
        code: newReallocatedTrigger.code.toString(),
        offenceSequenceNumber: newReallocatedTrigger.offenceSequenceNumber
      } as Trigger)
    : undefined

  const foundUnresolvedOutOfAreaTrigger = existingTriggers.some(
    (trigger) => trigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE && trigger.status === "Unresolved"
  )
  const existingOutOfAreaTrigger = existingTriggers.find((trigger) => trigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE)
  const newOutOfAreaTrigger = triggers.find((trigger) => trigger.code === OUT_OF_AREA_TRIGGER_CODE)
  const outOfAreaTrigger: Trigger | undefined = existingOutOfAreaTrigger
    ? ({ code: existingOutOfAreaTrigger.triggerCode } as Trigger)
    : newOutOfAreaTrigger
    ? ({ code: newOutOfAreaTrigger.code.toString() } as Trigger)
    : undefined

  const resolvedTriggers = existingTriggers.filter((trigger) => trigger.status === "Resolved")
  const foundResolvedOutOfAreaTrigger = resolvedTriggers.some(
    (trigger) => trigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE
  )
  totalUnresolvedTriggers -= existingTriggers.filter((existingTrigger) => existingTrigger.status === "Resolved").length

  let triggersToDelete: Trigger[] = existingTriggers
    .filter((existingTrigger) => !triggers.some((trigger) => trigger.code === existingTrigger.triggerCode))
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
            !existingTriggers.some((existingTrigger) => existingTrigger.triggerCode === trigger.code)
        )
  ).map((trigger) => ({
    code: trigger.code,
    offenceSequenceNumber: trigger.offenceSequenceNumber
  }))

  totalUnresolvedTriggers -=
    triggersToDelete.length +
    existingTriggers.filter((existingTrigger) =>
      triggers.some((trigger) => trigger.code === existingTrigger.triggerCode)
    ).length

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
      existingTriggers.some(
        (existingTrigger) =>
          existingTrigger.triggerCode === reallocatedTrigger.code &&
          existingTrigger.triggerItemIdentity === reallocatedTrigger.offenceSequenceNumber
      ) &&
      !triggersToDelete.some((triggerToDelete) => triggerToDelete.code === reallocatedTrigger?.code)
    ) {
      triggersToDelete.push(reallocatedTrigger)
    } else if (
      reallocatedTrigger &&
      triggersToAdd.some((triggerToAdd) => triggerToAdd.code === reallocatedTrigger.code)
    ) {
      triggersToAdd = triggersToAdd.filter((trigger) => trigger.code !== REALLOCATE_CASE_TRIGGER_CODE)
    }
  }

  if (triggersToAdd.length > 0 && totalUnresolvedTriggers == 2 && outOfAreaTrigger && reallocatedTrigger) {
    if (triggersToAdd.some((triggerToAdd) => triggerToAdd.code === outOfAreaTrigger.code)) {
      triggersToAdd = triggersToAdd.filter((triggerToAdd) => triggerToAdd.code === OUT_OF_AREA_TRIGGER_CODE)
    } else {
      triggersToDelete.push(outOfAreaTrigger)
    }

    if (
      existingTriggers.some((existingTrigger) => existingTrigger.triggerCode === REALLOCATE_CASE_TRIGGER_CODE) &&
      !triggersToDelete.some((triggerToDelete) => triggerToDelete.code === REALLOCATE_CASE_TRIGGER_CODE)
    ) {
      triggersToDelete = triggersToDelete.filter((trigger) => trigger.code === REALLOCATE_CASE_TRIGGER_CODE)
    }
  }

  return { triggersToAdd, triggersToDelete }
}

export default recalculateTriggers
