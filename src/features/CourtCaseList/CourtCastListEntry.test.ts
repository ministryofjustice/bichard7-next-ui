import Note from "services/entities/Note"
import { first100CharsOfMostRecentNote, getMostRecentNote } from "./CourtCaseListEntryHelperFunction"

describe("getMostRecentNote Test", () => {
  it("should return an object that contains createdAt and noteText values", () => {
    const caseNote = [
      {
        noteId: 1450,
        noteText:
          "Abdullah.Fahey: Portal Action: Record Manually Resolved. Reason: PNC record already has accurate results. Reason Text:",
        errorId: 415,
        userId: "tomasa.bogan",
        createdAt: "2023-02-11T10:36:11.488Z"
      }
    ] as unknown as Note[]

    const recentNote = getMostRecentNote(caseNote)

    expect(recentNote).toBeInstanceOf(Array)
    expect(recentNote).toHaveLength(1)
    expect(recentNote[0]).toHaveProperty("createdAt")
    expect(recentNote[0]).toHaveProperty("noteText")
  })

  it("should return the most recently dated note Object from many objects", () => {
    const caseNote = [
      {
        noteId: 1255,
        noteText:
          "Ova.Pfeffer: Portal Action: Record Manually Resolved. Reason: Updated remand(s) manually on the PNC. Reason Text:Molestias dolor officiis placeat adipisci ea a culpa vitae.",
        errorId: 362,
        userId: "gina.thiel",
        createdAt: "2022-01-01T00:00:00.000Z"
      },
      {
        noteId: 1254,
        noteText: "Wilson.Grady: Portal Action: Trigger Resolved. Code: TRPR0010",
        errorId: 362,
        userId: "coy.funk",
        createdAt: "2023-01-01T00:00:00.000Z"
      },
      {
        noteId: 1253,
        noteText: "Bernie.Ankunding: Portal Action: Trigger Resolved. Code: TRPR0001",
        errorId: 362,
        userId: "sonny.badger",
        createdAt: "2021-01-01T00:00:00.000Z"
      }
    ] as unknown as Note[]

    const recentNote = getMostRecentNote(caseNote)
    expect(recentNote).toBeInstanceOf(Array)
    expect(recentNote).toHaveLength(1)
    expect(recentNote[0].createdAt).toBe("2023-01-01T00:00:00.000Z")
  })
})

describe("parsing note text", () => {
  it("should return a string", () => {
    const sampleNoteText = "Example note text"
    const caseNote = [
      {
        noteId: 1255,
        noteText: sampleNoteText,
        errorId: 362,
        userId: "gina.thiel",
        createdAt: "2022-01-01T00:00:00.000Z"
      }
    ] as unknown as Note[]
    const result = first100CharsOfMostRecentNote(caseNote)
    expect(typeof result).toEqual("string")
    expect(result).toEqual(sampleNoteText)
  })

  it.only("should display the whole text when it is 100 characters or less", () => {
    const sampleNoteTextWith100Chars = "a".repeat(100)
    const caseNote = [
      {
        noteId: 1255,
        noteText: sampleNoteTextWith100Chars,
        errorId: 362,
        userId: "gina.thiel",
        createdAt: "2022-01-01T00:00:00.000Z"
      }
    ] as unknown as Note[]
    const result = first100CharsOfMostRecentNote(caseNote)
    expect(result).not.toContain("...")
    expect(result).toContain(sampleNoteTextWith100Chars)
  })
  it.only("should truncate the text when it is greater than 100 characters", () => {
    const sampleNoteTextMoreThan100Chars = "a".repeat(150)
    const expectedResult = `${"a".repeat(100)}...`
    const caseNote = [
      {
        noteId: 1255,
        noteText: sampleNoteTextMoreThan100Chars,
        errorId: 362,
        userId: "gina.thiel",
        createdAt: "2022-01-01T00:00:00.000Z"
      }
    ] as unknown as Note[]
    const result = first100CharsOfMostRecentNote(caseNote)
    expect(result).toStrictEqual(expectedResult)
    expect(result).toContain("...")
    expect(result.length).toEqual(103)
  })
})
