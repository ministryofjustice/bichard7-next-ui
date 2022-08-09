import { expect } from "@jest/globals"
import { isError } from "cypress/types/lodash"
import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import lockCourtCase from "services/lockCourtCase"
import { DataSource } from "typeorm"
import CourtCaseCase from "../../testFixtures/database/data/error_list.json"
import CourtCaseAho from "../../testFixtures/database/data/error_list_aho.json"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../../testFixtures/database/insertCourtCases"

const mockCourtCase = {
  ...CourtCaseCase,
  annotated_msg: CourtCaseAho.annotated_msg,
  court_date: "2008-09-25",
  org_for_police_filter: "36FPA1".padEnd(6, " "),
  error_id: 0,
  message_id: String(0).padStart(5, "x"),
  error_locked_by_id: null,
  trigger_locked_by_id: null
}

const insertRecords = async (errorLockedById: string | null = null, triggerLockedById: string | null = null) => {
  const existingCourtCases = [
    {
      ...mockCourtCase,
      error_locked_by_id: errorLockedById,
      trigger_locked_by_id: triggerLockedById
    }
  ]

  await insertCourtCases(existingCourtCases)
}

describe("Court case details page", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.mock("../../../src/services/getCourtCase", () => {
      return {
        default: jest.fn(() => mockCourtCase)
      }
    })
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should not overide the lock when the record is locked by another user", async () => {
    await insertRecords()
    
  })
})
