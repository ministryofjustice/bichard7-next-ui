import { expect } from "@jest/globals"
import lockCourtCase from "services/lockCourtCase"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import CourtCaseAho from "../testFixtures/database/data/error_list_aho.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../testFixtures/database/insertCourtCases"

const insertRecords = async (orgsCodes: string[]) => {
  const existingCourtCases = orgsCodes.map((code, i) => {
    return {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      court_date: "2008-09-25",
      org_for_police_filter: code.padEnd(6, " "),
      error_id: i,
      message_id: String(i).padStart(5, "x")
    }
  })

  await insertCourtCases(existingCourtCases)

  return existingCourtCases
}

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

  it("should lock a unlocked court case when viewed", async () => {
    const courtCase = (await insertRecords(["36FPA1"]))[0]
    const userName = "Bichard01"
    const expectedCourtCase = {
      errorId: courtCase.error_id,
      messageId: courtCase.message_id,
      courtDate: new Date("2008-09-25T00:00:00.000Z"),
      courtName: courtCase.court_name,
      defendantName: courtCase.defendant_name,
      errorReason: courtCase.error_reason,
      orgForPoliceFilter: courtCase.org_for_police_filter,
      ptiurn: courtCase.ptiurn,
      triggerReason: courtCase.trigger_reason,
      triggers: [],
      notes: [],
      errorCount: 0,
      triggerCount: 0,
      errorLockedById: userName,
      triggerLockedById: userName
    } as unknown as CourtCase

    const result = await lockCourtCase(dataSource, 0, userName)
    expect(isError(result)).toBe(false)

    const record = dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as unknown as CourtCase
    expect({ ...actualCourtCase }).toStrictEqual(expectedCourtCase)
  })
})
