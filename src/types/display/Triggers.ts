import Trigger from "services/entities/Trigger"

type displayPartialTriggerPickedFields = "triggerCode" | "description"

export type DisplayPartialTrigger = Pick<Trigger, displayPartialTriggerPickedFields>

type displayTriggerPickedFields = "shortTriggerCode" | "status" | "triggerId" | "triggerItemIdentity"

export type DisplayTrigger = Pick<Trigger, displayPartialTriggerPickedFields | displayTriggerPickedFields> & {
  createdAt: string
  resolvedAt?: string
}
