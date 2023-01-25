/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import DummyMultipleOffencesAho from "../test-data/HO100102_1.json"
import DummyCourtCase from "./DummyCourtCase"
import Note from "services/entities/Note"
import { ResolutionStatus } from "types/ResolutionStatus"
import Trigger from "services/entities/Trigger"

const getDummyCourtCase = async (overrides?: Partial<CourtCase>): Promise<CourtCase> =>
  (await getDataSource()).getRepository(CourtCase).create({
    ...DummyCourtCase,
    hearingOutcome: DummyMultipleOffencesAho.hearingOutcomeXml,
    ...overrides
  } as CourtCase)

const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<CourtCase[]> =>
  (await getDataSource()).getRepository(CourtCase).save(Array.isArray(courtCases) ? courtCases : [courtCases])

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

const insertCourtCasesWithFields = async (cases: Partial<CourtCase>[]) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < cases.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        courtDate: new Date("2" + String(index).padStart(3, "0") + "-01-01"),
        ...cases[index]
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCasesWithResolutionTimestamp = async (
  resolutionTimestamp: (Date | null)[],
  orgCode: string
) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < resolutionTimestamp.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        orgForPoliceFilter: orgCode.padEnd(6, " "),
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        errorCount: 1,
        triggerCount: 1,
        resolutionTimestamp: resolutionTimestamp[index] ?? null
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

const insertDummyCourtCasesWithNotes = async (caseNotes: { user: string; text: string }[][], orgCode: string) => {
  const existingCourtCases: CourtCase[] = await Promise.all(
    caseNotes.map((notes, index) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        notes: notes.map(
          (note, _) =>
            ({
              createdAt: new Date(),
              noteText: note.text,
              userId: note.user,
              errorId: index
            } as unknown as Note)
        )
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

const insertDummyCourtCasesWithTriggers = async (
  caseTriggers: { code: string; status: ResolutionStatus }[][],
  orgCode: string
) => {
  const existingCourtCases: CourtCase[] = await Promise.all(
    caseTriggers.map((triggers, index) =>
      getDummyCourtCase({
        orgForPoliceFilter: orgCode,
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        triggers: triggers.map(
          (trigger, _) =>
            ({
              createdAt: new Date(),
              triggerCode: trigger.code,
              errorId: index,
              status: trigger.status
            } as unknown as Trigger)
        )
      })
    )
  )

  return insertCourtCases(existingCourtCases)
}

export {
  getDummyCourtCase,
  insertCourtCases,
  insertCourtCasesWithFields,
  insertMultipleDummyCourtCases,
  insertDummyCourtCasesWithUrgencies,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithTriggers,
  insertMultipleDummyCourtCasesWithResolutionTimestamp
}
