import { expect } from "@jest/globals"
import MockDate from "mockdate"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import addNote from "../../src/services/addNote"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import CourtCaseAho from "../testFixtures/database/data/error_list_aho.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../testFixtures/database/insertCourtCases"
import Note from "../../src/services/entities/Note"

const note = "Dummy note"

const insertRecords = async (errorLockedById: string | null = null, triggerLockedById: string | null = null) => {
  const existingCourtCasesDbObject = [
    {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      court_date: "2008-09-25",
      org_for_police_filter: "36FPA1".padEnd(6, " "),
      error_id: 0,
      message_id: String(0).padStart(5, "x"),
      error_locked_by_id: errorLockedById,
      trigger_locked_by_id: triggerLockedById
    }
  ]

  await insertCourtCases(existingCourtCasesDbObject)
}

describe("addNote", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterEach(() => {
    MockDate.reset()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should add note when record is not locked by other user", async () => {
    await insertRecords()
    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, "User ID", note)

    expect(result).toStrictEqual({ isSuccessful: true })
    const record = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as Note
    expect(actualCourtCase.noteText).toBe(note)
    expect(actualCourtCase.userId).toBe("User ID")
    expect(actualCourtCase.createdAt).toEqual(date)
  })

  it("should not add note when error is locked by other user", async () => {
    await insertRecords("OtherUser")
    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, "User ID", note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case is locked by another user"
    })
    const record = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    expect(record).toBeNull()
  })

  it("should not add note when trigger is locked by other user", async () => {
    await insertRecords(null, "OtherUser")
    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, "User ID", note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case is locked by another user"
    })
    const actualNote = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    expect(actualNote).toBeNull()
  })

  it("should not add note when case does not exist", async () => {
    const result = await addNote(dataSource, 0, "User ID", note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case not found"
    })
    const actualNote = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    expect(actualNote).toBeNull()
  })

  it("should add multiple notes when note text length is more than the 1000 characters", async () => {
    await insertRecords()
    const date = new Date()
    MockDate.set(date)

    const result = await addNote(dataSource, 0, "User ID", "A".repeat(2503))
    expect(result).toStrictEqual({ isSuccessful: true })

    const actualNotes = await dataSource.getRepository(Note).find()
    expect(actualNotes).toHaveLength(3)
    expect({ ...actualNotes[0], noteId: 0 }).toStrictEqual({
      errorId: 0,
      createdAt: date,
      userId: "User ID",
      noteId: 0,
      noteText: "A".repeat(1000)
    })
    expect({ ...actualNotes[1], noteId: 0 }).toStrictEqual({
      errorId: 0,
      createdAt: date,
      userId: "User ID",
      noteId: 0,
      noteText: "A".repeat(1000)
    })
    expect({ ...actualNotes[2], noteId: 0 }).toStrictEqual({
      errorId: 0,
      createdAt: date,
      userId: "User ID",
      noteId: 0,
      noteText: "A".repeat(503)
    })
  })
})
