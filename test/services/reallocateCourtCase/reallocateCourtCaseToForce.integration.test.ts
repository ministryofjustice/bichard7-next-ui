import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import Note from "services/entities/Note"
import User from "services/entities/User"
import insertNotes from "services/insertNotes"
import reallocateCourtCaseToForce from "services/reallocateCourtCase/reallocateCourtCaseToForce"
import { DataSource, UpdateQueryBuilder } from "typeorm"
import CourtCase from "../../../src/services/entities/CourtCase"
import getDataSource from "../../../src/services/getDataSource"
import { isError } from "../../../src/types/Result"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import deleteFromDynamoTable from "../../utils/deleteFromDynamoTable"
import fetchAuditLogEvents from "../../helpers/fetchAuditLogEvents"
import { AUDIT_LOG_EVENT_SOURCE } from "../../../src/config"
import KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { hasAccessToAll } from "../../helpers/hasAccessTo"

jest.mock("services/insertNotes")

const createUnlockedEvent = (unlockReason: "Trigger" | "Exception", userName: string) => {
  return {
    attributes: { auditLogVersion: 2 },
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: `${unlockReason} unlocked`,
    timestamp: expect.anything(),
    eventCode: `${unlockReason.toLowerCase()}s.unlocked`,
    user: userName
  }
}

const createReallocationEvent = (newForceOwner: string, userName: string) => {
  return {
    attributes: {
      auditLogVersion: 2,
      "New Force Owner": newForceOwner
    },
    eventCode: "hearing-outcome.reallocated",
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Hearing outcome reallocated by user",
    timestamp: expect.anything(),
    user: userName
  }
}

const createTriggersGeneratedEvent = (triggers: string[], hasUnresolvedExceptions: boolean, userName: string) => {
  const triggersDetails = triggers.reduce((acc: KeyValuePair<string, unknown>, triggerCode, index) => {
    acc[`Trigger ${index + 1} Details`] = triggerCode
    return acc
  }, {})

  return {
    attributes: {
      auditLogVersion: 2,
      "Trigger and Exception Flag": hasUnresolvedExceptions,
      "Number of Triggers": triggers.length,
      ...triggersDetails
    },
    eventCode: "triggers.generated",
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Triggers generated",
    timestamp: expect.anything(),
    user: userName
  }
}

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
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(insertNotes as jest.Mock).mockImplementation(jest.requireActual("services/insertNotes").default)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when a user can see the case", () => {
    it("Should reallocate the case to a new force, generate system notes and unlock the case", async () => {
      const newForceCode = "04"
      const expectedForceOwner = `${newForceCode}YZ00`
      const userName = "UserName"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: userName,
          triggerLockedByUsername: userName
        }
      ])

      const user = {
        username: userName,
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

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

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(4)
      expect(events).toContainEqual(createReallocationEvent(expectedForceOwner, user.username))
      expect(events).toContainEqual(createUnlockedEvent("Exception", user.username))
      expect(events).toContainEqual(createUnlockedEvent("Trigger", user.username))
      expect(events).toContainEqual(
        createTriggersGeneratedEvent(
          [TriggerCode.TRPR0003, TriggerCode.TRPR0004, TriggerCode.TRPR0004],
          true,
          user.username
        )
      )
    })

    it("Should reallocate the case to a new force, generate system notes, user note, and unlock the case", async () => {
      const newForceCode = "04"
      const expectedForceOwner = `${newForceCode}YZ00`
      const userName = "UserName"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: userName,
          triggerLockedByUsername: userName
        }
      ])

      const user = {
        username: userName,
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, newForceCode, "Dummy user note")
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
      expect(actualCourtCase.notes).toHaveLength(3)
      const notes = actualCourtCase.notes.sort((noteA, noteB) => (noteA.createdAt > noteB.createdAt ? 1 : -1))

      expect(notes[0].userId).toEqual("System")
      expect(notes[0].noteText).toEqual(
        `${userName}: Portal Action: Update Applied. Element: forceOwner. New Value: ${newForceCode}`
      )
      expect(notes[1].userId).toEqual("System")
      expect(notes[1].noteText).toEqual(`${userName}: Case reallocated to new force owner: ${expectedForceOwner}`)

      expect(notes[2].userId).toEqual(userName)
      expect(notes[2].noteText).toEqual("Dummy user note")

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(4)
      expect(events).toContainEqual(createReallocationEvent(expectedForceOwner, user.username))
      expect(events).toContainEqual(createUnlockedEvent("Exception", user.username))
      expect(events).toContainEqual(createUnlockedEvent("Trigger", user.username))
      expect(events).toContainEqual(
        createTriggersGeneratedEvent(
          [TriggerCode.TRPR0003, TriggerCode.TRPR0004, TriggerCode.TRPR0004],
          true,
          user.username
        )
      )
    })
  })

  describe("when the case is not visible to the user", () => {
    it("Should return an error and not perform any of reallocation steps", async () => {
      const anotherOrgCode = "02XX  "

      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: anotherOrgCode,
          errorId: courtCaseId
        }
      ])

      const user = {
        username: "Dummy User",
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Failed to reallocate: Case not found`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(anotherOrgCode)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })
  })

  describe("when the case is locked by another user", () => {
    it("Should return an error and not perform any of reallocation steps", async () => {
      const anotherUser = "Someone Else"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: anotherUser,
          triggerLockedByUsername: anotherUser
        }
      ])

      const user = {
        username: "Dummy User",
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Court case is locked by another user`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toStrictEqual("Someone Else")
      expect(actualCourtCase.triggerLockedByUsername).toStrictEqual("Someone Else")
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })
  })

  describe("when there is an unexpected error", () => {
    it("Should return the error if fails to create notes", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId
        }
      ])

      const user = {
        username: "Dummy User",
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      ;(insertNotes as jest.Mock).mockImplementationOnce(() => new Error(`Error while creating notes`))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Error while creating notes`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })

    it("Should return the error when fails to update orgForPoliceFilter", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId
        }
      ])

      const user = {
        username: "Dummy User",
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Failed to update record with some error`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })
  })
})
