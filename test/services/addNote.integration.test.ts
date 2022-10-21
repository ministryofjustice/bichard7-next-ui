import MockDate from "mockdate"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import addNote from "../../src/services/addNote"
import deleteFromTable from "../utils/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import insertNotes from "services/insertNotes"

jest.mock("services/insertNotes")

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
    jest.resetAllMocks()
    jest.clearAllMocks()
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

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [{ errorId: 0, noteText: note, userId: "username" }])

    expect(result).toStrictEqual({ isSuccessful: true })
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

    expect(insertNotes).toHaveBeenCalledTimes(0)
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
    expect(insertNotes).toHaveBeenCalledTimes(0)
  })

  it("should not add note when case does not exist", async () => {
    const result = await addNote(dataSource, 0, "username", note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case not found"
    })

    expect(insertNotes).toHaveBeenCalledTimes(0)
  })

  it("should add multiple notes when note text length is more than the 1000 characters", async () => {
    await insertRecords()

    const result = await addNote(dataSource, 0, "username", "A".repeat(2503))
    expect(result).toStrictEqual({ isSuccessful: true })

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: 0, noteText: "A".repeat(1000), userId: "username" },
      { errorId: 0, noteText: "A".repeat(1000), userId: "username" },
      { errorId: 0, noteText: "A".repeat(503), userId: "username" }
    ])
  })
})
