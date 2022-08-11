import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import CourtCase from "../../../src/services/entities/CourtCase"
import { InsertResult } from "typeorm"
import getDataSource from "../../../src/services/getDataSource"
import DummyCourtCase from "./data/error_list.json"
import DummyAho from "./data/error_list_aho.json"

const getDummyCourtCase = async (overrides?: Partial<CourtCase>): Promise<CourtCase> => {
  const dataSource = await getDataSource()
  return dataSource.getRepository(CourtCase).create({ ...DummyCourtCase, ...overrides })
}
const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.createQueryBuilder().insert().into(CourtCase).values(courtCases).execute()
}

const insertCourtCasesWithOrgCodes = async (orgsCodes: string[]) => {
  const existingCourtCases = await Promise.all(
    orgsCodes.map(
      async (code, i) =>
        await getDummyCourtCase({
          hearingOutcome: parseAhoXml(DummyAho.annotated_msg) as AnnotatedHearingOutcome,
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
    courtNames.map(
      async (name, i) =>
        await getDummyCourtCase({
          hearingOutcome: parseAhoXml(DummyAho.annotated_msg) as AnnotatedHearingOutcome,
          orgForPoliceFilter: orgCode,
          errorId: i,
          messageId: String(i).padStart(5, "x"),
          ptiurn: "Case" + String(i).padStart(5, "0"),
          courtName: name,
          defendantName: DummyCourtCase.defendant_name + i,
          courtDate: new Date("2" + String(i).padStart(3, "0") + "-01-01")
        })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtDates = async (courtDates: Date[], orgCode: string) => {
  const existingCourtCases = await Promise.all(
    courtDates.map(
      async (date, i) =>
        await getDummyCourtCase({
          hearingOutcome: parseAhoXml(DummyAho.annotated_msg) as AnnotatedHearingOutcome,
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
    defendantNames.map(
      async (name, i) =>
        await getDummyCourtCase({
          hearingOutcome: parseAhoXml(DummyAho.annotated_msg) as AnnotatedHearingOutcome,
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

const insertMultipleDummyCourtCases = (numToInsert: number, orgCode: string) => {
  const existingCourtCases = [...Array(numToInsert).fill(DummyCourtCase)].map((elem, i: number) => {
    return {
      ...elem,
      org_for_police_filter: orgCode,
      message_id: String(i).padStart(5, "x"),
      error_id: i,
      ptiurn: "Case" + String(i).padStart(5, "0")
    }
  })

  return insertCourtCases(existingCourtCases)
}

export {
  getDummyCourtCase,
  insertCourtCases,
  insertCourtCasesWithOrgCodes,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithCourtDates,
  insertCourtCasesWithDefendantNames,
  insertMultipleDummyCourtCases
}
