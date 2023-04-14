import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import Note from "services/entities/Note"
import User from "services/entities/User"
import reallocateCourtCaseToForce from "services/reallocateCourtCaseToForce"
import { DataSource, UpdateResult } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

describe("reallocate court case to another force", () => {
  const courtCaseId = 1
  const oldForceCode = "01"
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Note)
    await deleteFromEntity(CourtCase)
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when user can see the case", () => {
    it("should reallocate the case to a new force, generate notes and unlock the case", async () => {
      const courtCase = {
        orgForPoliceFilter: oldForceCode,
        errorId: courtCaseId
      }

      const newForceCode = "04"
      const expectedForceOwner = `${newForceCode}YZ00`
      const userName = "UserName"
      await insertCourtCasesWithFields([courtCase])

      const user = {
        username: userName,
        visibleForces: [oldForceCode],
        canLockExceptions: true,
        canLockTriggers: true
      } as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, newForceCode)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual("04YZ  ")
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const parsedUpdatedHearingOutcome = parseAhoXml(actualCourtCase.updatedHearingOutcome as string)
      expect(parsedUpdatedHearingOutcome).not.toBeInstanceOf(Error)

      const parsedCase = (parsedUpdatedHearingOutcome as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome
        .Case

      expect(parsedCase.ForceOwner?.OrganisationUnitCode).toEqual(expectedForceOwner)
      expect(parsedCase.ForceOwner?.BottomLevelCode).toEqual("00")
      expect(parsedCase.ForceOwner?.SecondLevelCode).toEqual(newForceCode)
      expect(parsedCase.ForceOwner?.ThirdLevelCode).toEqual("YZ")
      expect(parsedCase.ManualForceOwner).toBe(true)
      expect(actualCourtCase.notes).toHaveLength(2)

      expect(actualCourtCase.notes[0].userId).toEqual("System")
      expect(actualCourtCase.notes[0].noteText).toEqual(
        `${userName}: Portal Action: Update Applied. Element: forceOwner. New Value: ${newForceCode}`
      )
      expect(actualCourtCase.notes[1].userId).toEqual("System")
      expect(actualCourtCase.notes[1].noteText).toEqual(
        `${userName}: Case reallocated to new force owner: ${expectedForceOwner}`
      )
    })
  })

  describe("when the case is not visible to the user", () => {
    it("should return an error and not perform any of reallocation steps", async () => {
      const anotherOrgCode = "02XX  "
      const courtCase = {
        orgForPoliceFilter: anotherOrgCode,
        errorId: courtCaseId
      }

      await insertCourtCasesWithFields([courtCase])

      const user = {
        username: "Dummy User",
        visibleForces: [oldForceCode],
        canLockExceptions: true,
        canLockTriggers: true
      } as User

      let result: UpdateResult | Error
      try {
        result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06")
      } catch (error) {
        result = error as Error
      }
      expect(result).toEqual(Error(`Failed to get court case`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(anotherOrgCode)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)
    })
  })

  describe("when the case is locked by another user", () => {
    it("should return an error and not perform any of reallocation steps", async () => {
      const anotherUser = "Someone Else"
      const courtCase = {
        orgForPoliceFilter: oldForceCode,
        errorId: courtCaseId,
        errorLockedByUsername: anotherUser,
        triggerLockedByUsername: anotherUser
      }

      await insertCourtCasesWithFields([courtCase])

      const user = {
        username: "Dummy User",
        visibleForces: [oldForceCode],
        canLockExceptions: true,
        canLockTriggers: true
      } as User

      let result: UpdateResult | Error
      try {
        result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06")
      } catch (error) {
        result = error as Error
      }
      expect(result).toEqual(Error(`Court case is locked by another user`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toStrictEqual("Someone Else")
      expect(actualCourtCase.triggerLockedByUsername).toStrictEqual("Someone Else")
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)
    })
  })
})
