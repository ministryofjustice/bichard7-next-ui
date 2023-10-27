import { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "./deleteFromEntity"

type TestTrigger = {
  triggerId: number
  triggerCode: string
  status: ResolutionStatus
  triggerItemIdentity?: number
  createdAt: Date
  resolvedBy?: string
  resolvedAt?: Date
}

const insertTriggers = async (caseId: number, triggers: TestTrigger[]): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Trigger)
    .values(
      triggers.map((t) => {
        return {
          resolvedAt: t.status === "Resolved" ? new Date() : null,
          resolvedBy: t.status === "Resolved" ? "Dummy User" : null,
          errorId: caseId,
          ...t
        }
      })
    )
    .execute()

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      triggerCount: () => `trigger_count + ${triggers.length}`,
      triggerReason: triggers[triggers.length - 1].triggerCode
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}

const deleteTriggers = async () => deleteFromEntity(Trigger)

export type { TestTrigger }
export { insertTriggers, deleteTriggers }
