import Trigger from "services/entities/Trigger"
import { DisplayTrigger } from "types/display/Triggers"

export const triggerToDisplayTrigger = (trigger: Trigger): DisplayTrigger => {
  const displayTrigger: DisplayTrigger = {
    createdAt: trigger.createdAt.toISOString(),
    triggerCode: trigger.triggerCode,
    description: trigger.description
  }

  if (trigger.resolvedAt) {
    displayTrigger.resolvedAt = trigger.resolvedAt.toISOString()
  }

  return displayTrigger
}
