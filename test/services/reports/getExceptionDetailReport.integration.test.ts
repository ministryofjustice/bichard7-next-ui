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
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import getExceptionDetailReport from "services/reports/getExceptionDetailReport"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const forceCode = "036"
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

    // const query = await insertMultipleDummyCourtCases(10, orgCode, {
    //   orgForPoliceFilter: orgCode,
    //   errorResolvedTimestamp: new Date()
    // })
    // expect(isError(query)).toBe(false)

    await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

    const { result, totalCases } = (await getExceptionDetailReport(
      dataSource,
      { from, to },
      testUser
    )) as ListCourtCaseResult

    expect(result).toHaveLength(0)
    expect(totalCases).toBe(0)
  })
})
