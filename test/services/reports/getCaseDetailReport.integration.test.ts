/* eslint-disable @typescript-eslint/naming-convention */

import "reflect-metadata"
import Note from "services/entities/Note"
import User from "services/entities/User"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource } from "typeorm"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import CourtCase from "../../../src/services/entities/CourtCase"
import Trigger from "../../../src/services/entities/Trigger"
import getDataSource from "../../../src/services/getDataSource"
import { exceptionHandlerHasAccessTo, hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import getExceptionDetailReport, { CaseDetailsReportType } from "services/reports/getCaseDetailReport"
import { insertCourtCasesWithFields, insertMultipleDummyCourtCases } from "../../utils/insertCourtCases"
import { isError } from "types/Result"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const forceCode = "036"
  const orgCode = "36FPA1"
  const testUser = {
    visibleForces: [forceCode],
    visibleCourts: ["B42AZ01"],
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
    ;(leftJoinAndSelectTriggersQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/leftJoinAndSelectTriggersQuery").default
    )
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Does not return report when user does not have permission", async () => {
    const from = "2024-05-07 11:26:57.853"
    const to = "2024-06-07 11:26:57.853"
    const testUserWithoutPermission = {
      visibleForces: [forceCode],
      visibleCourts: ["B42AZ01"],
      hasAccessTo: exceptionHandlerHasAccessTo
    } as Partial<User> as User

    const query = await insertMultipleDummyCourtCases(10, orgCode, {
      orgForPoliceFilter: orgCode,
      errorResolvedTimestamp: new Date("2024-05-07 11:26:57.853")
    })
    expect(isError(query)).toBe(false)

    const { result, totalCases } = (await getExceptionDetailReport(
      dataSource,
      { from, to },
      testUserWithoutPermission
    )) as ListCourtCaseResult

    expect(result).toHaveLength(0)
    expect(totalCases).toBe(0)
  })

  it("Returns report containing cases with exceptions within date range", async () => {
    const from = "2024-05-05 11:26:57.853"
    const to = "2024-06-05 11:26:57.853"
    const casesWithExceptions: Partial<CourtCase>[] = Array.from(Array(5)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      errorResolvedTimestamp: new Date(`2024-05-0${index + 1} 11:26:57.853`)
    }))
    const casesWithTriggers: Partial<CourtCase>[] = Array.from(Array(5)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      triggerResolvedTimestamp: new Date(`2024-05-0${index + 1} 11:26:57.853`)
    }))
    const query = await insertCourtCasesWithFields(casesWithExceptions.concat(casesWithTriggers))
    expect(isError(query)).toBe(false)

    const { result, totalCases } = (await getExceptionDetailReport(
      dataSource,
      { from, to },
      testUser,
      CaseDetailsReportType.Exceptions
    )) as ListCourtCaseResult

    expect(result).toHaveLength(1)
    expect(totalCases).toBe(1)
    expect(result[0].errorResolvedTimestamp).toEqual(new Date("2024-05-05 11:26:57.853"))
    expect(result[0].triggerResolvedTimestamp).toBeFalsy()
  })

  it("Returns report containing cases with triggers within date range", async () => {
    const from = "2024-05-05 11:26:57.853"
    const to = "2024-06-05 11:26:57.853"
    const casesWithExceptions: Partial<CourtCase>[] = Array.from(Array(5)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      errorResolvedTimestamp: new Date(`2024-05-0${index + 1} 11:26:57.853`)
    }))
    const casesWithTriggers: Partial<CourtCase>[] = Array.from(Array(5)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      triggerResolvedTimestamp: new Date(`2024-05-0${index + 1} 11:26:57.853`)
    }))
    const query = await insertCourtCasesWithFields(casesWithExceptions.concat(casesWithTriggers))
    expect(isError(query)).toBe(false)

    const { result, totalCases } = (await getExceptionDetailReport(
      dataSource,
      { from, to },
      testUser,
      CaseDetailsReportType.Triggers
    )) as ListCourtCaseResult

    expect(result).toHaveLength(1)
    expect(totalCases).toBe(1)
    expect(result[0].triggerResolvedTimestamp).toEqual(new Date("2024-05-05 11:26:57.853"))
    expect(result[0].errorResolvedTimestamp).toBeFalsy()
  })

  it("Returns report containing cases with exceptions and triggers within date range", async () => {
    const from = "2024-05-05 11:26:57.853"
    const to = "2024-06-05 11:26:57.853"
    const casesWithExceptions: Partial<CourtCase>[] = Array.from(Array(5)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      errorResolvedTimestamp: new Date(`2024-05-0${index + 1} 11:26:57.853`)
    }))
    const casesWithTriggers: Partial<CourtCase>[] = Array.from(Array(5)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      triggerResolvedTimestamp: new Date(`2024-05-0${index + 1} 11:26:57.853`)
    }))
    const query = await insertCourtCasesWithFields(casesWithExceptions.concat(casesWithTriggers))
    expect(isError(query)).toBe(false)

    const { result, totalCases } = (await getExceptionDetailReport(
      dataSource,
      { from, to },
      testUser
    )) as ListCourtCaseResult

    expect(result).toHaveLength(2)
    expect(totalCases).toBe(2)
    expect(result[0].errorResolvedTimestamp).toEqual(new Date("2024-05-05 11:26:57.853"))
    expect(result[1].triggerResolvedTimestamp).toEqual(new Date("2024-05-05 11:26:57.853"))
  })
})