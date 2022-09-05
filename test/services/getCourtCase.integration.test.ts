import { DataSource } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import getCourtCase from "../../src/services/getCourtCase"
import { getDummyCourtCase, insertCourtCases } from "../util/insertCourtCases"
import deleteFromTable from "../util/deleteFromTable"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/services/entities/CourtCase"

jest.setTimeout(60 * 60 * 1000)

describe("get court case", () => {
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

  it("should amend the court case", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toBe(null)

    const result = await getCourtCase(dataSource, inputCourtCase.errorId)
    expect(isError(result)).toBe(false)

    expect(result).toStrictEqual(inputCourtCase)
  })

  it("should return null if the court case doesn't exist", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })
    const result = await getCourtCase(dataSource, inputCourtCase.errorId)

    expect(result).toBeNull()
  })
})
