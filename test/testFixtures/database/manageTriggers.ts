import CourtCase from "entities/CourtCase"
import Trigger from "entities/Trigger"
import getDataSource from "lib/getDataSource"

type TestTrigger = {
  triggerId: number
  triggerCode: string
  status: number
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
        return { ...t, errorId: caseId }
      })
    )
    .execute()

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      triggerCount: () => "trigger_count + 1",
      triggerReason: triggers.map((t) => t.triggerCode).join(", ")
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  await dataSource.destroy()

  return true
}

export type { TestTrigger }
export { insertTriggers }
