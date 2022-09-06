import { DataSource, UpdateQueryBuilder } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import unlockCourtCase from "../../src/services/unlockCourtCase"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../util/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../util/insertCourtCases"

describe("lock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should unlock a locked court case", async () => {
    const lockedByName = "some user"
    const lockedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: lockedByName,
      triggerLockedByUsername: lockedByName
    })
    await insertCourtCases(lockedCourtCase)

    const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId)
    expect(isError(result)).toBe(false)

    const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
    const actualCourtCase = record as CourtCase
    expect(actualCourtCase.errorLockedByUsername).toBeNull()
    expect(actualCourtCase.triggerLockedByUsername).toBeNull()
  })

  it("should return the error when failed to unlock court case", async () => {
    jest
      .spyOn(UpdateQueryBuilder<CourtCase>.prototype, "execute")
      .mockRejectedValue(Error("Failed to update record with some error"))

    const lockedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: "dummy",
      triggerLockedByUsername: "dummy"
    })
    await insertCourtCases(lockedCourtCase)

    const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId)
    expect(isError(result)).toBe(true)

    const receivedError = result as Error

    expect(receivedError.message).toEqual("Failed to update record with some error")
  })
})
