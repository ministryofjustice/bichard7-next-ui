import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import leftJoinAndSelectTriggersWithExclusionQuery from "services/queries/leftJoinAndSelectTriggersWithExclusionQuery"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertDummyCourtCasesWithTriggers } from "../utils/insertCourtCases"
import { ResolutionStatus } from "types/ResolutionStatus"
import Trigger from "services/entities/Trigger"

describe("leftJoinAndSelectTriggersWithExclusionQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>
  const dummyOrgCode = "01"
  const testTrigger: { code: string; status: ResolutionStatus } = {
    code: "TRPR0001",
    status: "Unresolved"
  }

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Trigger)
    await deleteFromEntity(CourtCase)
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  describe("When there aren't any excluded triggers", () => {
    it("should return a list of cases with triggers are empty", async () => {
      await insertDummyCourtCasesWithTriggers(
        [[testTrigger, testTrigger, testTrigger], [testTrigger, testTrigger], [testTrigger]],
        dummyOrgCode
      )

      const result = await (leftJoinAndSelectTriggersWithExclusionQuery(query, []) as SelectQueryBuilder<CourtCase>)
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      expect(cases).toHaveLength(3)
      expect(cases[0].triggers).toHaveLength(3)
      expect(cases[1].triggers).toHaveLength(2)
      expect(cases[2].triggers).toHaveLength(1)
    })

    it("should return a list of cases with triggers are undefined", async () => {
      await insertDummyCourtCasesWithTriggers([[testTrigger, testTrigger]], dummyOrgCode)

      const result = await (
        leftJoinAndSelectTriggersWithExclusionQuery(query, undefined) as SelectQueryBuilder<CourtCase>
      )
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      expect(cases).toHaveLength(1)
      expect(cases[0].triggers).toHaveLength(2)
    })
  })

  describe("When there are excluded triggers", () => {
    it("should return cases with triggers that are not excluded", async () => {
      const excludedTriggerCodes = ["TRPR0001", "TRPR0003"]
      const caseOneTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: excludedTriggerCodes[0],
          status: "Unresolved"
        },
        {
          code: excludedTriggerCodes[1],
          status: "Unresolved"
        }
      ]

      const caseTwoTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: excludedTriggerCodes[0],
          status: "Unresolved"
        },
        {
          code: "TRPR0002",
          status: "Unresolved"
        },
        {
          code: excludedTriggerCodes[1],
          status: "Unresolved"
        }
      ]
      await insertDummyCourtCasesWithTriggers([caseOneTriggers, caseTwoTriggers], dummyOrgCode)

      const result = await (
        leftJoinAndSelectTriggersWithExclusionQuery(query, excludedTriggerCodes) as SelectQueryBuilder<CourtCase>
      )
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)

      expect(result).toHaveLength(2)
      const cases = result as CourtCase[]
      expect(cases[0].triggers).toHaveLength(0)
      expect(cases[1].triggers).toHaveLength(1)
      expect(cases[1].triggers[0].triggerCode).toEqual("TRPR0002")
    })
  })
})
