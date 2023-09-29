import Trigger from "services/entities/Trigger"
import { DisplayPartialTrigger, DisplayTrigger } from "types/display/Triggers"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"

export const triggerToPartialDisplayTriggerDto = (triggerCode: string): DisplayPartialTrigger => {
  return {
    triggerCode,
    description: getTriggerWithDescription(triggerCode)
  }
}

export const triggerToDisplayTriggerDto = (trigger: Trigger): DisplayTrigger => {
  const displayTrigger: DisplayTrigger = {
    createdAt: trigger.createdAt.toISOString(),
    description: trigger.description,
    shortTriggerCode: trigger.shortTriggerCode,
    status: trigger.status,
    triggerCode: trigger.triggerCode,
    triggerId: trigger.triggerId
  }

  if (trigger.triggerItemIdentity) {
    displayTrigger.triggerItemIdentity = trigger.triggerItemIdentity
  }

  if (trigger.resolvedAt) {
    displayTrigger.resolvedAt = trigger.resolvedAt.toISOString()
  }

  return displayTrigger
}
