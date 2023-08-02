import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import { TriggersOutcome } from "../../types/TriggersOutcome"
import { default as TriggerEntity } from "../entities/Trigger"
import { isEmpty } from "lodash"
import { TriggerCode } from "@moj-bichard7-developers/bichard7-next-core/dist/types/TriggerCode"

const containsTrigger = (triggers: Trigger[], trigger?: Trigger): boolean => {
  if (!trigger) {
    return false
  }
  return triggers.some((t) => t.code === trigger.code && t.offenceSequenceNumber === trigger.offenceSequenceNumber)
}

const findTriggerCode = (triggers: TriggerEntity[], code: TriggerCode) => {
  return triggers.find((trigger) => trigger.triggerCode === code)
}

const asTrigger = (triggerEntity: TriggerEntity): Trigger => {
  return {
    code: triggerEntity.triggerCode,
    offenceSequenceNumber: triggerEntity.triggerItemIdentity
  } as Trigger
}

const recalculateTriggers = (existingTriggers: TriggerEntity[], triggers: Trigger[]): TriggersOutcome => {
  const existingTriggersDetails = existingTriggers.map((existingTrigger) => asTrigger(existingTrigger))

  const existingUnresolvedTriggers = existingTriggers.filter(
    (existingTrigger) => existingTrigger.status === "Unresolved"
  )
  const existingResolvedTriggers = existingTriggers.filter((existingTrigger) => existingTrigger.status === "Resolved")
  const existingUnresolvedReallocatedTrigger = findTriggerCode(existingUnresolvedTriggers, REALLOCATE_CASE_TRIGGER_CODE)
  const existingUnresolvedOutOfAreaTrigger = findTriggerCode(existingUnresolvedTriggers, OUT_OF_AREA_TRIGGER_CODE)

  const newReallocatedTrigger = triggers.find((newTrigger) => newTrigger.code === REALLOCATE_CASE_TRIGGER_CODE)
  const newOutOfAreaTrigger = triggers.find((newTrigger) => newTrigger.code === OUT_OF_AREA_TRIGGER_CODE)

  let reallocatedTrigger = existingUnresolvedReallocatedTrigger
    ? asTrigger(existingUnresolvedReallocatedTrigger)
    : newReallocatedTrigger

  const outOfAreaTrigger = existingUnresolvedOutOfAreaTrigger
    ? asTrigger(existingUnresolvedOutOfAreaTrigger)
    : newOutOfAreaTrigger

  const newUnresolvedTriggersAlreadyOnCase = existingUnresolvedTriggers
    .filter((unresolvedTrigger) => !containsTrigger(triggers, asTrigger(unresolvedTrigger)))
    .map(
      (triggerEntity) =>
        ({ code: triggerEntity.triggerCode, offenceSequenceNumber: triggerEntity.triggerItemIdentity }) as Trigger
    )

  const newTriggersThatAreNotOnTheCase = triggers.filter(
    (newTrigger) =>
      isEmpty(existingTriggers) || (!isEmpty(existingTriggers) && !containsTrigger(existingTriggersDetails, newTrigger))
  )

  const newOutOfAreaTriggers = triggers.filter(
    (newTrigger) =>
      newTrigger.code === OUT_OF_AREA_TRIGGER_CODE &&
      !!findTriggerCode(existingResolvedTriggers, OUT_OF_AREA_TRIGGER_CODE) &&
      !existingUnresolvedOutOfAreaTrigger
  )

  const newResolvedTriggersAlreadyOnCase = triggers.filter(
    (newTrigger) =>
      !containsTrigger(newOutOfAreaTriggers, newTrigger) && containsTrigger(existingTriggersDetails, newTrigger)
  )

  const totalUnresolvedTriggers =
    existingTriggers.length +
    triggers.length -
    newUnresolvedTriggersAlreadyOnCase.length -
    newResolvedTriggersAlreadyOnCase.length -
    existingResolvedTriggers.length

  const triggersOutcome: TriggersOutcome = {
    triggersToAdd: newTriggersThatAreNotOnTheCase.concat(newOutOfAreaTriggers),
    triggersToDelete: newUnresolvedTriggersAlreadyOnCase
  }

  if (totalUnresolvedTriggers === 0 && reallocatedTrigger && isEmpty(triggersOutcome.triggersToAdd)) {
    if (!!existingUnresolvedReallocatedTrigger) {
      triggersOutcome.triggersToDelete = triggersOutcome.triggersToDelete.filter(
        (deletedTrigger) => deletedTrigger.code !== reallocatedTrigger?.code
      )
    } else {
      triggersOutcome.triggersToAdd.push(reallocatedTrigger)
    }
  }

  if (!isEmpty(triggersOutcome.triggersToAdd)) {
    if (totalUnresolvedTriggers > 2 || (totalUnresolvedTriggers === 2 && !outOfAreaTrigger && reallocatedTrigger)) {
      if (
        containsTrigger(existingTriggersDetails, reallocatedTrigger) &&
        !containsTrigger(triggersOutcome.triggersToDelete, reallocatedTrigger)
      ) {
        triggersOutcome.triggersToDelete.push(reallocatedTrigger!)
      } else if (containsTrigger(triggersOutcome.triggersToAdd, reallocatedTrigger)) {
        triggersOutcome.triggersToAdd = triggersOutcome.triggersToAdd.filter(
          (triggerToAdd) => triggerToAdd.code !== reallocatedTrigger?.code
        )
      }
      reallocatedTrigger = undefined
    }

    if (totalUnresolvedTriggers === 2 && outOfAreaTrigger && reallocatedTrigger) {
      if (containsTrigger(triggersOutcome.triggersToAdd, outOfAreaTrigger)) {
        triggersOutcome.triggersToAdd = triggersOutcome.triggersToAdd.filter(
          (triggerToAdd) => triggerToAdd.code !== outOfAreaTrigger?.code
        )
      } else {
        triggersOutcome.triggersToDelete.push(outOfAreaTrigger)
      }
    }
  }

  return triggersOutcome
}

export default recalculateTriggers
