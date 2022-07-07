import { expect } from "@jest/globals"
import { DataSource } from "typeorm"
import CourtCase from "../../src/entities/CourtCase"
import getDataSource from "../../src/lib/getDataSource"
import { isError } from "../../src/types/Result"
import getCourtCase from "../../src/useCases/getCourtCase"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import insertCourtCases from "../testFixtures/database/insertCourtCases"

const insertRecords = async (orgsCodes: string[]) => {
  const existingCourtCases = orgsCodes.map((code, i) => {
    return {
      ...CourtCaseCase,
      court_date: "2008-09-25",
      org_for_police_filter: code.padEnd(6, " "),
      error_id: i,
      message_id: String(i).padStart(5, "x")
    }
  })

  await insertCourtCases(existingCourtCases)

  return existingCourtCases
}

describe("listCourtCases", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should return court case details when record exists and is visible to the specified forces", async () => {
    const courtCase = (await insertRecords(["36FPA1"]))[0]
    const expectedCourtCase = {
      errorId: courtCase.error_id,
      messageId: courtCase.message_id,
      courtDate: new Date("2008-09-25T00:00:00.000Z"),
      courtName: courtCase.court_name,
      defendantName: courtCase.defendant_name,
      errorReason: courtCase.error_reason,
      orgForPoliceFilter: courtCase.org_for_police_filter,
      ptiurn: courtCase.ptiurn,
      triggerReason: courtCase.trigger_reason
    } as CourtCase

    let result = await getCourtCase(dataSource, 0, ["036FPA1"])
    expect(isError(result)).toBe(false)

    let actualCourtCase = result as CourtCase
    expect({ ...actualCourtCase }).toStrictEqual(expectedCourtCase)

    result = await getCourtCase(dataSource, 0, ["036"])
    expect(isError(result)).toBe(false)

    actualCourtCase = result as CourtCase
    expect({ ...actualCourtCase }).toStrictEqual(expectedCourtCase)
  })

  it("should return null if the court case doesn't exist", async () => {
    const result = await getCourtCase(dataSource, 0, ["036FPA1"])

    expect(result).toBeNull()
  })

  it("should return null when record exists and is not visible to the specified forces", async () => {
    await insertRecords(["36FPA3"])
    const result = await getCourtCase(dataSource, 0, ["036FPA1"])

    expect(result).toBeNull()
  })

  it("should return null when record exists and there is no visible forces", async () => {
    await insertRecords(["36FPA3"])
    const result = await getCourtCase(dataSource, 0, [])

    expect(result).toBeNull()
  })
})
