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

  await dataSource.destroy()

  return true
}

export type { TestTrigger }
export { insertTriggers }
