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
    // 1 get a Force Code and update orgForPoliceFilter to that code appended with YZ -> 01YZ
    // 2 Add system notes:
    //    - Portal Action: Update Applied. Element: FORCEOWNER. New Value: 01
    //    - Bichard01: Case reallocated to new force owner : 01YZ00
    // 3 Push messages to GENERAL_EVENT_QUEUE(audit log)
    // 4 unlocks the case
    it("should reallocate the case to a new force, generate notes and unlock the case", async () => {
      const courtCase = {
        orgForPoliceFilter: "36FPA ",
        errorId: 1
      }
      await insertCourtCasesWithFields([courtCase])

      const user = {
        visibleForces: ["36FPA1"]
      } as User

      const result = await reallocateCourtCaseToForce(dataSource, 1, user, "04")
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 1 } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual("04YZ  ")
    })
  })

  // TODO:
  // cannot reallocate a case that is locked by another user
  // cannot reallocate a case that is not visible for the user
  // when there is an error
  // should return the error when failed to reallocate court case
})
