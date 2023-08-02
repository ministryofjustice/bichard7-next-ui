import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import { TriggersOutcome } from "../../types/TriggersOutcome"
import { default as TriggerEntity } from "../entities/Trigger"

const containsTrigger = (triggers: Trigger[], trigger?: Trigger): boolean => {
  if (!trigger) {
    return false
  }
  return triggers.some((t) => t.code === trigger.code && t.offenceSequenceNumber === trigger.offenceSequenceNumber)
}

const recalculateTriggers = (existingTriggers: TriggerEntity[], triggers: Trigger[]): TriggersOutcome => {
  const triggersOutcome: TriggersOutcome = {
    triggersToAdd: [],
    triggersToDelete: []
  }

  const existingTriggersDetails: Trigger[] = []
  const resolvedTriggers = []

  let reallocatedTrigger: Trigger | undefined
  let outOfAreaTrigger: Trigger | undefined

  let outOfAreaTriggerFoundResolved = false
  let outOfAreaTriggerFoundUnresolved = false
  let reallocatedTriggerFoundUnresolved = false

  let totalUnresolvedTriggers = existingTriggers.length + triggers.length

  if (existingTriggers.length !== 0) {
    existingTriggers.forEach((existingTrigger) => {
      const existingTriggerDetails = {
        code: existingTrigger.triggerCode,
        offenceSequenceNumber: existingTrigger.triggerItemIdentity
      } as Trigger
      existingTriggersDetails.push(existingTriggerDetails)

      if (existingTrigger.status === "Unresolved") {
        if (existingTriggerDetails.code === REALLOCATE_CASE_TRIGGER_CODE) {
          reallocatedTrigger = existingTriggerDetails
          reallocatedTriggerFoundUnresolved = true
        }

        if (existingTriggerDetails.code === OUT_OF_AREA_TRIGGER_CODE) {
          outOfAreaTrigger = existingTriggerDetails
          outOfAreaTriggerFoundUnresolved = true
        }

        if (triggers.length === 0 || (triggers.length !== 0 && !containsTrigger(triggers, existingTriggerDetails))) {
          triggersOutcome.triggersToDelete.push(existingTriggerDetails)

          totalUnresolvedTriggers--
        }
      }

      if (existingTrigger.status === "Resolved") {
        if (existingTriggerDetails.code === OUT_OF_AREA_TRIGGER_CODE) {
          outOfAreaTriggerFoundResolved = true
        }

        resolvedTriggers.push(existingTriggerDetails)

        totalUnresolvedTriggers--
      }
    })
  }

  if (triggers.length !== 0) {
    triggers.forEach((newTrigger) => {
      if (newTrigger.code === REALLOCATE_CASE_TRIGGER_CODE) {
        reallocatedTrigger = newTrigger
      } else if (newTrigger.code === OUT_OF_AREA_TRIGGER_CODE) {
        outOfAreaTrigger = newTrigger
      }
      if (
        existingTriggers.length === 0 ||
        (newTrigger.code === OUT_OF_AREA_TRIGGER_CODE &&
          outOfAreaTriggerFoundResolved &&
          !outOfAreaTriggerFoundUnresolved) ||
        (existingTriggers.length !== 0 && !containsTrigger(existingTriggersDetails, newTrigger))
      ) {
        triggersOutcome.triggersToAdd.push(newTrigger)
      } else if (containsTrigger(existingTriggersDetails, newTrigger)) {
        totalUnresolvedTriggers--
      }
    })
  }

  if (totalUnresolvedTriggers == 0 && reallocatedTrigger && triggersOutcome.triggersToAdd.length === 0) {
    if (reallocatedTriggerFoundUnresolved) {
      triggersOutcome.triggersToDelete = triggersOutcome.triggersToDelete.filter(
        (deletedTrigger) => deletedTrigger.code !== reallocatedTrigger?.code
      )
    } else {
      triggersOutcome.triggersToAdd.push(reallocatedTrigger)
    }
  }

  if (triggersOutcome.triggersToAdd.length !== 0) {
    if (totalUnresolvedTriggers > 2 || (totalUnresolvedTriggers == 2 && !outOfAreaTrigger && reallocatedTrigger)) {
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

    if (totalUnresolvedTriggers == 2 && outOfAreaTrigger && reallocatedTrigger) {
      if (containsTrigger(triggersOutcome.triggersToAdd, outOfAreaTrigger)) {
        triggersOutcome.triggersToAdd = triggersOutcome.triggersToAdd.filter(
          (triggerToAdd) => triggerToAdd.code !== outOfAreaTrigger?.code
        )
      } else {
        triggersOutcome.triggersToDelete.push(outOfAreaTrigger)
      }
      if (
        containsTrigger(existingTriggersDetails, reallocatedTrigger) &&
        !containsTrigger(triggersOutcome.triggersToDelete, reallocatedTrigger)
      ) {
        triggersOutcome.triggersToDelete = triggersOutcome.triggersToDelete.filter(
          (triggerDeleted) => triggerDeleted.code !== reallocatedTrigger?.code //TODO: This code does not do anything!
        )
      }
    }
  }

  return triggersOutcome
}

export default recalculateTriggers
