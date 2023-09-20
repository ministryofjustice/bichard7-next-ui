import Trigger from "services/entities/Trigger"

export type DisplayTrigger = Pick<Trigger, "triggerCode" | "description"> & {
  createdAt: string
  resolvedAt?: string
}
