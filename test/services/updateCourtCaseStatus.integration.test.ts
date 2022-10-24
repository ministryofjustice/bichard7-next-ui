import { DataSource, UpdateResult } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import deleteFromTable from "../utils/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import { isError } from "services/mq/types/Result"
import { ResolutionStatus } from "types/ResolutionStatus"
const courtCaseId = 0

const insertRecord = async (
  errorLockedByUsername: string | null = null,
  triggerLockedByUsername: string | null = null,
  errorStatus: ResolutionStatus | undefined = undefined,
  triggerStatus: ResolutionStatus | undefined = undefined
) => {
  const existingCourtCasesDbObject = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: courtCaseId,
      messageId: String(0).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername,
      errorStatus: errorStatus,
      triggerStatus: triggerStatus
    })
  ]

  await insertCourtCases(existingCourtCasesDbObject)
}

describe("updateCourtCaseStatus", () => {
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

  it("should not update if the court case doesn't exist", async () => {
    const nonExistentCase = 9999
    const result = await updateCourtCaseStatus(dataSource, nonExistentCase, "Error", "Submitted")

    expect((result as UpdateResult).raw).toHaveLength(0)
    expect((result as UpdateResult).affected).toBe(0)
  })

  it("can update the error status", async () => {
    await insertRecord()

    const result = await updateCourtCaseStatus(dataSource, 0, "Error", "Submitted")
    expect(isError(result)).toBe(false)

    const courtCaseRow = (result as UpdateResult).raw[0]
    expect(courtCaseRow.error_status).toEqual(3)
    expect(courtCaseRow.trigger_status).toBeNull()
  })

  it("can update the error status", async () => {
    await insertRecord()

    const result = await updateCourtCaseStatus(dataSource, 0, "Trigger", "Submitted")
    expect(isError(result)).toBe(false)

    const courtCaseRow = (result as UpdateResult).raw[0]
    expect(courtCaseRow.trigger_status).toEqual(3)
    expect(courtCaseRow.error_status).toBeNull()
  })
})
