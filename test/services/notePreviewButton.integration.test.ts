import MockDate from "mockdate"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import deleteFromTable from "../utils/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import Note from "../../src/services/entities/Note"
import insertNotes from "services/insertNotes"
import { isError } from "services/mq/types/Result"
const courtCaseId = 0

const insertRecords = async (
  errorLockedByUsername: string | null = null,
  triggerLockedByUsername: string | null = null
) => {
  const existingCourtCasesDbObject = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: courtCaseId,
      messageId: String(0).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername
    })
  ]

  await insertCourtCases(existingCourtCasesDbObject)
}

describe("insertNote", () => {
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

//  
// when there is 1 note
// when there is many notes




  it("should grab the most recent create note text", async () => {
    const note = {
      errorId: courtCaseId,
      userId: "System",
      noteText: "Test note"
    }
    await insertRecords()
    const date = new Date()
    MockDate.set(date)

    const result = await insertNotes(dataSource, [note])

    expect(isError(result)).toBe(false)

    const record = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as Note
    expect(actualCourtCase.noteText).toBe(note.noteText)
    expect(actualCourtCase.userId).toBe("System")
    expect(actualCourtCase.createdAt).toEqual(date)
  })
})
