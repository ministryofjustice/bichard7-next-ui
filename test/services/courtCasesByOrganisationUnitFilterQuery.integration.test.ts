import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import deleteFromEntity from "../utils/deleteFromEntity"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"
import courtCasesByOrganisationUnitFilterQuery from "services/queries/courtCasesByOrganisationUnitFilterQuery"

jest.mock(
  "services/queries/courtCasesByVisibleForcesQuery",
  jest.fn(() =>
    jest.fn((query) => {
      return query
    })
  )
)

describe("courtCasesByOrganisationUnitFilterQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should call cases by visible forces query", async () => {
    const forceCode = "dummyForceCode"

    courtCasesByOrganisationUnitFilterQuery(query, [forceCode])

    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledWith(expect.any(Object), [forceCode])
  })
})
