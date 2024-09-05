import listCourtCases from "services/listCourtCases"
import { DateRange } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource } from "typeorm"
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)

describe("Filter cases by resolved date", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
  const forceCode = "036"
  const testUser = {
    visibleForces: [forceCode],
    visibleCourts: [],
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

  it("Returns resolved cases within given date range", async () => {
    const resolvedDateRange = {
      from: new Date("2024-05-3"),
      to: new Date("2024-05-7 23:59:59.000")
    } as DateRange
    await insertCourtCasesWithFields(
      Array.from(Array(8)).map((_, index) => ({
        orgForPoliceFilter: orgCode,
        resolutionTimestamp: new Date(`2024-05-0${index + 1}`),
        errorResolvedTimestamp: new Date(`2024-05-0${index + 1}`),
        triggerResolvedTimestamp: new Date(`2024-05-0${index + 1}`)
      }))
    )

    const { result, totalCases } = (await listCourtCases(
      dataSource,
      { resolvedDateRange, caseState: "Resolved" },
      testUser
    )) as ListCourtCaseResult

    console.log(
      "Result: ",
      result.map((r) => r.resolutionTimestamp)
    )

    expect(result).toHaveLength(5)
    expect(totalCases).toBe(5)
    expect(result[0].resolutionTimestamp?.toString()).toBe(new Date(`2024-05-03`).toString())
    expect(result[2].resolutionTimestamp?.toString()).toBe(new Date(`2024-05-05`).toString())
    expect(result[4].resolutionTimestamp?.toString()).toBe(new Date(`2024-05-07`).toString())
  })
})
