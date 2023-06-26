import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import User from "services/entities/User"
import Trigger from "services/entities/Trigger"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"

jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

describe("getCourtCaseByOrganisationUnits", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Trigger)
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(leftJoinAndSelectTriggersQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/leftJoinAndSelectTriggersQuery").default
    )
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should call leftJoinAndSelectTriggersQuery with the correct arguments", async () => {
    const dummyErrorId = 0
    const dummyExcludedTriggers = ["TRPDUMMY"]
    await getCourtCaseByOrganisationUnit(dataSource, dummyErrorId, {
      visibleForces: [orgCode],
      visibleCourts: [],
      excludedTriggers: dummyExcludedTriggers
    } as Partial<User> as User)

    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledTimes(1)
    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledWith(expect.any(Object), dummyExcludedTriggers)
  })

  it("Should return court case details when record exists and is visible to the specified forces", async () => {
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

  // Old Bichard generates inclusion list from visibleForces and visibleCourts
  // then checks these against both orgForPoliceFilter and courtCode
  it("Should return a case where the users' visibleForce matches the courtCode", async () => {
    const inputCourtCase = await getDummyCourtCase({
      courtCode: orgCode.padEnd(6, " "),
      orgForPoliceFilter: null
    })
    await insertCourtCases(inputCourtCase)
    const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [orgCode.substring(0, 2)],
      visibleCourts: []
    } as Partial<User> as User)
    expect(isError(result)).toBe(false)

    const actualCourtCase = result as CourtCase
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })

  it("Should return a case where the users' visibleCourt matches the orgForPoliceFilter", async () => {
    const inputCourtCase = await getDummyCourtCase({
      courtCode: null,
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)
    const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [],
      visibleCourts: [orgCode.substring(0, 2)]
    } as Partial<User> as User)
    expect(isError(result)).toBe(false)

    const actualCourtCase = result as CourtCase
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })

  it("Should return null if the court case doesn't exist", async () => {
    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [orgCode],
      visibleCourts: []
    } as Partial<User> as User)

    expect(result).toBeNull()
  })

  it("Should return null when record exists and is not visible to the specified forces", async () => {
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

  it("Should return null when record exists and there is no visible forces", async () => {
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
