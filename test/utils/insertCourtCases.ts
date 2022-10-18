/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCase from "../../src/services/entities/CourtCase"
import { InsertResult } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import DummyAho from "../test-data/error_list_aho.json"
import DummyCourtCase from "./DummyCourtCase"

const getDummyCourtCase = async (overrides?: Partial<CourtCase>): Promise<CourtCase> =>
  (await getDataSource()).getRepository(CourtCase).create({
    ...DummyCourtCase,
    hearingOutcome: DummyAho.hearingOutcomeXml,
    ...overrides
  } as CourtCase)

const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.createQueryBuilder().insert().into(CourtCase).values(courtCases).execute()
}

const insertCourtCasesWithOrgCodes = async (orgsCodes: string[]) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < orgsCodes.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgsCodes[index].padEnd(6, " "),
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        errorCount: 1,
        triggerCount: 1
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtNames = async (courtNames: string[], orgCode: string) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < courtNames.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        courtName: courtNames[index],
        defendantName: DummyCourtCase.defendantName! + String(index),
        courtDate: new Date("2" + String(index).padStart(3, "0") + "-01-01")
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtDates = async (courtDates: Date[], orgCode: string) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < courtDates.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        courtDate: courtDates[index]
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithDefendantNames = async (defendantNames: string[], orgCode: string) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < defendantNames.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        defendantName: defendantNames[index],
        courtDate: new Date("2" + String(index).padStart(3, "0") + "-01-01")
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCases = async (numToInsert: number, orgCode: string) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < numToInsert; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        messageId: String(index).padStart(5, "x"),
        errorId: index,
        ptiurn: "Case" + String(index).padStart(5, "0"),
        defendantName: `Defendant Name ${index}`
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertDummyCourtCaseWithLock = async (
  errorLockedByUsername: string,
  triggerLockedByUsername: string,
  orgsCodes: string[]
) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < orgsCodes.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgsCodes[index].padEnd(6, " "),
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        errorLockedByUsername: errorLockedByUsername,
        triggerLockedByUsername: triggerLockedByUsername,
        errorCount: 1,
        triggerCount: 1
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertDummyCourtCasesWithUrgencies = async (urgencies: boolean[], orgCode: string) => {
  const existingCourtCases: CourtCase[] = await Promise.all(
    urgencies.map((urgency, index) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        isUrgent: urgency
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
  insertDummyCourtCaseWithLock,
  insertDummyCourtCasesWithUrgencies
}
