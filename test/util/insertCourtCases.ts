/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCase from "../../src/services/entities/CourtCase"
import { DataSource, InsertResult } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import DummyAho from "./error_list_aho.json"
import DummyCourtCase from "./DummyCourtCase"

const getDummyCourtCase = (dataSource: DataSource, overrides?: Partial<CourtCase>): CourtCase =>
  dataSource.getRepository(CourtCase).create({
    ...DummyCourtCase,
    hearingOutcome: DummyAho.hearingOutcomeXml,
    ...overrides
  } as CourtCase)

const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.createQueryBuilder().insert().into(CourtCase).values(courtCases).execute()
}

const insertCourtCasesWithOrgCodes = async (orgsCodes: string[]) => {
  const dataSource = await getDataSource()
  const existingCourtCases = orgsCodes.map((code, i) =>
    getDummyCourtCase(dataSource, {
      orgForPoliceFilter: code.padEnd(6, " "),
      errorId: i,
      messageId: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0")
    })
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtNames = async (courtNames: string[], orgCode: string) => {
  const dataSource = await getDataSource()
  const existingCourtCases = courtNames.map((name, i) =>
    getDummyCourtCase(dataSource, {
      orgForPoliceFilter: orgCode,
      errorId: i,
      messageId: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      courtName: name,
      defendantName: DummyCourtCase.defendantName! + i,
      courtDate: new Date("2" + String(i).padStart(3, "0") + "-01-01")
    })
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtDates = async (courtDates: Date[], orgCode: string) => {
  const dataSource = await getDataSource()
  const existingCourtCases = courtDates.map((date, i) =>
    getDummyCourtCase(dataSource, {
      orgForPoliceFilter: orgCode,
      errorId: i,
      messageId: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      courtDate: date
    })
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithDefendantNames = async (defendantNames: string[], orgCode: string) => {
  const dataSource = await getDataSource()
  const existingCourtCases = defendantNames.map((name, i) =>
    getDummyCourtCase(dataSource, {
      orgForPoliceFilter: orgCode,
      errorId: i,
      messageId: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      defendantName: name,
      courtDate: new Date("2" + String(i).padStart(3, "0") + "-01-01")
    })
  )

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCases = async (numToInsert: number, orgCode: string) => {
  const dataSource = await getDataSource()
  const existingCourtCases = Object.keys(new Array(numToInsert).fill(undefined)).map((i) =>
    getDummyCourtCase(dataSource, {
      orgForPoliceFilter: orgCode,
      messageId: i.padStart(5, "x"),
      errorId: +i,
      ptiurn: "Case" + i.padStart(5, "0")
    })
  )

  return insertCourtCases(existingCourtCases)
}

const insertDummyCourtCaseWithLock = async (
  errorLockedById: string,
  triggerLockedById: string,
  orgsCodes: string[]
) => {
  const dataSource = await getDataSource()
  const existingCourtCases = orgsCodes.map((code, i) =>
    getDummyCourtCase(dataSource, {
      orgForPoliceFilter: code.padEnd(6, " "),
      errorId: i,
      messageId: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      errorLockedById: errorLockedById,
      triggerLockedById: triggerLockedById
    })
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
