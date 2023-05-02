import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import User from "services/entities/User"
import { TestTrigger, insertTriggers } from "../utils/manageTriggers"
import Trigger from "services/entities/Trigger"

describe("getCourtCaseByOrganisationUnits", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Trigger)
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return court case details when record exists and is visible to the specified forces", async () => {
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)

    let result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [orgCode],
      visibleCourts: []
    } as Partial<User> as User)
    expect(isError(result)).toBe(false)

    let actualCourtCase = result as CourtCase
    expect(actualCourtCase).toStrictEqual(inputCourtCase)

    result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [orgCode.substring(0, 2)],
      visibleCourts: []
    } as Partial<User> as User)
    expect(isError(result)).toBe(false)

    actualCourtCase = result as CourtCase
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })

  it("should exclude triggers that are excluded for the user", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorId: 0,
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)

    const excludedTriggerCode = "TRPR0009"
    const firstTrigger: TestTrigger = {
      triggerId: 0,
      status: "Unresolved",
      triggerCode: "TRPR0002",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    const secondTrigger: TestTrigger = {
      triggerId: 1,
      status: "Unresolved",
      triggerCode: "TRPR0009",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    await insertTriggers(0, [firstTrigger, secondTrigger])

    const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [orgCode],
      visibleCourts: [],
      excludedTriggers: [excludedTriggerCode]
    } as Partial<User> as User)
    expect(isError(result)).toBe(false)

    const courtCase = result as CourtCase
    expect(courtCase.triggers).toHaveLength(1)
    expect(courtCase.triggers[0].triggerCode).toEqual("TRPR0002")
  })

  it("should return null if the court case doesn't exist", async () => {
    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [orgCode],
      visibleCourts: []
    } as Partial<User> as User)

    expect(result).toBeNull()
  })

  it("should return null when record exists and is not visible to the specified forces", async () => {
    const differentOrgCode = "36FPA3"
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)
    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [differentOrgCode],
      visibleCourts: []
    } as Partial<User> as User)

    expect(result).toBeNull()
  })

  it("should return null when record exists and there is no visible forces", async () => {
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)
    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [],
      visibleCourts: []
    } as Partial<User> as User)

    expect(result).toBeNull()
  })
})
