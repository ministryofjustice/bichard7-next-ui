import MockDate from "mockdate"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import addNote from "../../src/services/addNote"
import deleteFromTable from "../util/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../util/insertCourtCases"
import Note from "../../src/services/entities/Note"

const note = "Dummy note"

const insertRecords = async (
  errorLockedByUsername: string | null = null,
  triggerLockedByUsername: string | null = null
) => {
  const existingCourtCasesDbObject = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: 0,
      messageId: String(0).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername
    })
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
    const result = await addNote(dataSource, 0, "username", note)

    expect(result).toStrictEqual({ isSuccessful: true })
    const record = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as Note
    expect(actualCourtCase.noteText).toBe(note)
    expect(actualCourtCase.userId).toBe("username")
    expect(actualCourtCase.createdAt).toEqual(date)
  })

  it("should not add note when error is locked by other user", async () => {
    await insertRecords("OtherUser")
    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, "username", note)

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
    const result = await addNote(dataSource, 0, "username", note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case is locked by another user"
    })
    const actualNote = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    expect(actualNote).toBeNull()
  })

  it("should not add note when case does not exist", async () => {
    const result = await addNote(dataSource, 0, "username", note)

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

    const result = await addNote(dataSource, 0, "username", "A".repeat(2503))
    expect(result).toStrictEqual({ isSuccessful: true })

    const actualNotes = await dataSource.getRepository(Note).find()
    expect(actualNotes).toHaveLength(3)
    expect({ ...actualNotes[0], noteId: 0 }).toStrictEqual({
      errorId: 0,
      createdAt: date,
      userId: "username",
      noteId: 0,
      noteText: "A".repeat(1000)
    })
    expect({ ...actualNotes[1], noteId: 0 }).toStrictEqual({
      errorId: 0,
      createdAt: date,
      userId: "username",
      noteId: 0,
      noteText: "A".repeat(1000)
    })
    expect({ ...actualNotes[2], noteId: 0 }).toStrictEqual({
      errorId: 0,
      createdAt: date,
      userId: "username",
      noteId: 0,
      noteText: "A".repeat(503)
    })
  })
})
