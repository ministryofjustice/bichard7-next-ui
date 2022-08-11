import { expect } from "@jest/globals"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import unlockCourtCase from "../../src/services/unlockCourtCase"
import { isError } from "../../src/types/Result"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../testFixtures/database/insertCourtCases"

describe("lock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should unlock a locked court case", async () => {
    const lockedByName = "some user"
    await insertCourtCases([
      {
        ...CourtCaseCase,
        error_id: 0,
        error_locked_by_id: lockedByName,
        trigger_locked_by_id: lockedByName
      }
    ])

    const existingCourtCase = (await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: 0 } })) as CourtCase

    const result = await unlockCourtCase(dataSource, existingCourtCase)
    expect(isError(result)).toBe(false)

    const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as CourtCase
    expect(actualCourtCase.errorLockedById).toBeNull()
    expect(actualCourtCase.triggerLockedById).toBeNull()
  })
})
