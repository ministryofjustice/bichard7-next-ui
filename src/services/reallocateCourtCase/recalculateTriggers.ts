import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import CourtCase from "../entities/CourtCase"
import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"

const containsTrigger = (triggers: Trigger[], trigger: Trigger | null): boolean => {
  if (trigger === null) {
    return false
  }
  return triggers.some((t) => t.code === trigger.code && t.offenceSequenceNumber === trigger.offenceSequenceNumber)
}

const recalculateTriggers = (
  courtCase: CourtCase,
  triggers: Trigger[]
): { triggersToAdd: Trigger[]; triggersDeleted: Trigger[] } => {
  const triggersOutcome: { triggersToAdd: Trigger[]; triggersDeleted: Trigger[] } = {
    triggersToAdd: [],
    triggersDeleted: []
  }
  const existingTriggers = courtCase.triggers
  const existingTriggersDetails: Trigger[] = []
  const resolvedTriggers = []

  let reallocatedTrigger: Trigger | null = null
  let outOfAreaTrigger: Trigger | null = null

  let outOfAreaTriggerFoundResolved = false
  let outOfAreaTriggerFoundUnresolved = false

  let reallocatedTriggerFoundUnresolved = false

  let totalUnresolvedTriggers = existingTriggers.length + triggers.length

  if (!(existingTriggers.length === 0)) {
    existingTriggers.forEach((existingTrigger) => {
      const triggerCode = existingTrigger.triggerCode
      const triggerID = existingTrigger.triggerItemIdentity

      const existingTriggerDetails = { code: triggerCode, offenceSequenceNumber: triggerID } as Trigger
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
          triggersOutcome.triggersDeleted.push(existingTriggerDetails)

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

  if (totalUnresolvedTriggers == 0 && reallocatedTrigger != null && triggersOutcome.triggersToAdd.length === 0) {
    if (reallocatedTriggerFoundUnresolved) {
      triggersOutcome.triggersDeleted = triggersOutcome.triggersDeleted.filter(
        (deletedTrigger) => deletedTrigger.code !== reallocatedTrigger?.code
      )
    } else {
      triggersOutcome.triggersToAdd.push(reallocatedTrigger)
    }
  }

  if (triggersOutcome.triggersToAdd.length !== 0) {
    if (
      totalUnresolvedTriggers > 2 ||
      (totalUnresolvedTriggers == 2 && outOfAreaTrigger === null && reallocatedTrigger !== null)
    ) {
      if (
        containsTrigger(existingTriggersDetails, reallocatedTrigger) &&
        !containsTrigger(triggersOutcome.triggersDeleted, reallocatedTrigger)
      ) {
        triggersOutcome.triggersDeleted.push(reallocatedTrigger!)
      } else if (containsTrigger(triggersOutcome.triggersToAdd, reallocatedTrigger)) {
        triggersOutcome.triggersToAdd = triggersOutcome.triggersToAdd.filter(
          (triggerToAdd) => triggerToAdd.code !== reallocatedTrigger?.code
        )
      }
      reallocatedTrigger = null
    }

    if (totalUnresolvedTriggers == 2 && outOfAreaTrigger != null && reallocatedTrigger != null) {
      if (containsTrigger(triggersOutcome.triggersToAdd, outOfAreaTrigger)) {
        triggersOutcome.triggersToAdd = triggersOutcome.triggersToAdd.filter(
          (triggerToAdd) => triggerToAdd.code !== outOfAreaTrigger?.code
        )
      } else {
        triggersOutcome.triggersDeleted.push(outOfAreaTrigger)
      }

      if (
        containsTrigger(existingTriggersDetails, reallocatedTrigger) &&
        !containsTrigger(triggersOutcome.triggersDeleted, reallocatedTrigger)
      ) {
        triggersOutcome.triggersDeleted = triggersOutcome.triggersDeleted.filter(
          (triggerDeleted) => triggerDeleted.code !== reallocatedTrigger?.code
        )
      }
    }
  }

  return triggersOutcome
}

export default recalculateTriggers
