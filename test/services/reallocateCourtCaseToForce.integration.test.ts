import User from "services/entities/User"
import reallocateCourtCaseToForce from "services/reallocateCourtCaseToForce"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../utils/deleteFromTable"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

describe("reallocate court case to another force", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when user can see the case", () => {
    // TODO:
    // - Add system notes:
    //    - Portal Action: Update Applied. Element: FORCEOWNER. New Value: 01
    //    - Bichard01: Case reallocated to new force owner : 01YZ00
    // - Push messages to GENERAL_EVENT_QUEUE(audit log) -> add auditLog messages
    it("should reallocate the case to a new force, generate notes and unlock the case", async () => {
      const courtCaseId = 1
      const courtCase = {
        orgForPoliceFilter: "36FPA ",
        errorId: courtCaseId,
        errorLockedByUsername: "UserName",
        triggerLockedByUsername: "UserName"
      }
      await insertCourtCasesWithFields([courtCase])

      const user = {
        username: "UserName",
        visibleForces: ["36FPA1"],
        canLockExceptions: true,
        canLockTriggers: true
      } as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "04")
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual("04YZ  ")
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
    })
  })

  // TODO:
  // cannot reallocate a case that is locked by another user
  // cannot reallocate a case that is not visible for the user
  // when there is an error
  // should return the error when failed to reallocate court case
})
