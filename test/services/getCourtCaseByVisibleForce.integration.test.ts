import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import getCourtCaseByVisibleForce from "../../src/services/getCourtCaseByVisibleForce"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../util/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../util/insertCourtCases"

describe("getCourtCaseByVisibleForces", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return court case details when record exists and is visible to the specified forces", async () => {
    const orgCode = "36FPA1"
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)

    let result = await getCourtCaseByVisibleForce(dataSource, inputCourtCase.errorId, [orgCode])
    expect(isError(result)).toBe(false)

    let actualCourtCase = result as CourtCase
    expect(actualCourtCase).toStrictEqual(inputCourtCase)

    result = await getCourtCaseByVisibleForce(dataSource, inputCourtCase.errorId, [orgCode.substring(0, 2)])
    expect(isError(result)).toBe(false)

    actualCourtCase = result as CourtCase
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })

  it("should return null if the court case doesn't exist", async () => {
    const result = await getCourtCaseByVisibleForce(dataSource, 0, ["36FPA1"])

    expect(result).toBeNull()
  })

  it("should return null when record exists and is not visible to the specified forces", async () => {
    const orgCode = "36FPA1"
    const differentOrgCode = "36FPA3"
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)
    const result = await getCourtCaseByVisibleForce(dataSource, 0, [differentOrgCode])

    expect(result).toBeNull()
  })

  it("should return null when record exists and there is no visible forces", async () => {
    const orgCode = "36FPA1"
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: orgCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)
    const result = await getCourtCaseByVisibleForce(dataSource, 0, [])

    expect(result).toBeNull()
  })
})
