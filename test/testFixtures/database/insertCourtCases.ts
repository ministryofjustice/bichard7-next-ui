import CourtCase from "../../../src/services/entities/CourtCase"
import { InsertResult } from "typeorm"
import getDataSource from "../../../src/services/getDataSource"
import DummyAho from "./data/error_list_aho.json"

const DummyCourtCase: Partial<CourtCase> = {
  courtName: "Magistrates' Courts Essex Basildon",
  courtDate: new Date("2008-09-26"),
  ptiurn: "42CY0300108",
  defendantName: "Allocation Trigger",
  errorReason: "",
  triggerReason: "",
  errorId: 79507,
  messageId: "cf60600b-52a0-4bc7-b117-3acfb851a7f5",
  phase: 2,
  errorStatus: 2,
  triggerStatus: 1,
  errorQualityChecked: 1,
  triggerQualityChecked: 1,
  triggerCount: 0,
  errorLockedById: null,
  triggerLockedById: null,
  urgency: 1,
  asn: "0836FP0100000377244A",
  courtCode: "B42AZ01",
  hearingOutcome: DummyAho.hearingOutcomeXml,
  updatedHearingOutcome: null,
  errorReport: "",
  createdTimestamp: new Date("2022-06-30 09:44:03.93"),
  errorCount: 0,
  userUpdatedFlag: true,
  resolutionTimestamp: null,
  messageReceivedTimestamp: new Date("2022-06-30 09:44:03.93"),
  errorResolvedBy: "essex.user",
  triggerResolvedBy: null,
  errorResolvedTimestamp: new Date("2022-06-30 09:44:11.182"),
  triggerResolvedTimestamp: null,
  orgForPoliceFilter: "36FP  ",
  courtRoom: "01",
  courtReference: "42CY0300108",
  errorInsertedTimestamp: new Date("2022-06-30 09:44:03.99"),
  triggerInsertedTimestamp: new Date("2022-06-30 09:44:11.193"),
  pncUpdateEnabled: "Y",
  notes: [],
  triggers: []
}

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
    orgsCodes.map(
      async (code, i) =>
        await getDummyCourtCase({
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
    courtDates.map(
      async (date, i) =>
        await getDummyCourtCase({
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
