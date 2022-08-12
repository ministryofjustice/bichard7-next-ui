/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCase from "../../src/services/entities/CourtCase"
import { InsertResult } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import DummyAho from "./error_list_aho.json"
import DummyCourtCase from "./DummyCourtCase"

const getDummyCourtCase = async (overrides?: Partial<CourtCase>): Promise<CourtCase> => {
  const dataSource = await getDataSource()
  return dataSource.getRepository(CourtCase).create({
    ...DummyCourtCase,
    hearingOutcome: DummyAho.hearingOutcomeXml,
    ...overrides
  } as CourtCase)
}
const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.createQueryBuilder().insert().into(CourtCase).values(courtCases).execute()
}

const insertCourtCasesWithOrgCodes = async (orgsCodes: string[]) => {
  const existingCourtCases = await Promise.all(
    orgsCodes.map((code, i) =>
      getDummyCourtCase({
        orgForPoliceFilter: code.padEnd(6, " "),
        errorId: i,
        messageId: String(i).padStart(5, "x"),
        ptiurn: "Case" + String(i).padStart(5, "0")
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtNames = async (courtNames: string[], orgCode: string) => {
  const existingCourtCases = await Promise.all(
    courtNames.map((name, i) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: i,
        messageId: String(i).padStart(5, "x"),
        ptiurn: "Case" + String(i).padStart(5, "0"),
        courtName: name,
        defendantName: DummyCourtCase.defendantName! + i,
        courtDate: new Date("2" + String(i).padStart(3, "0") + "-01-01")
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtDates = async (courtDates: Date[], orgCode: string) => {
  const existingCourtCases = await Promise.all(
    courtDates.map((date, i) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: i,
        messageId: String(i).padStart(5, "x"),
        ptiurn: "Case" + String(i).padStart(5, "0"),
        courtDate: date
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithDefendantNames = async (defendantNames: string[], orgCode: string) => {
  const existingCourtCases = await Promise.all(
    defendantNames.map((name, i) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: i,
        messageId: String(i).padStart(5, "x"),
        ptiurn: "Case" + String(i).padStart(5, "0"),
        defendantName: name,
        courtDate: new Date("2" + String(i).padStart(3, "0") + "-01-01")
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCases = async (numToInsert: number, orgCode: string) => {
  const existingCourtCases = await Promise.all(
    new Array(numToInsert).fill(undefined).map((_, i) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        messageId: String(i).padStart(5, "x"),
        errorId: i,
        ptiurn: "Case" + String(i).padStart(5, "0")
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertDummyCourtCaseWithLock = async (
  errorLockedById: string,
  triggerLockedById: string,
  orgsCodes: string[]
) => {
  const existingCourtCases = await Promise.all(
    orgsCodes.map((code, i) =>
      getDummyCourtCase({
        orgForPoliceFilter: code.padEnd(6, " "),
        errorId: i,
        messageId: String(i).padStart(5, "x"),
        ptiurn: "Case" + String(i).padStart(5, "0"),
        errorLockedById: errorLockedById,
        triggerLockedById: triggerLockedById
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

export {
  getDummyCourtCase,
  insertCourtCases,
  insertCourtCasesWithOrgCodes,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithCourtDates,
  insertCourtCasesWithDefendantNames,
  insertMultipleDummyCourtCases,
  insertDummyCourtCaseWithLock
}
