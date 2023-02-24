import { getMostRecentNote, first100CharsOfMostRecentNote, validatedMostRecentNoteDate } from "./CourtCaseListEntry"
import Note from "services/entities/Note"

describe("getMostRecentNote Test", () => {
  console.log(first100CharsOfMostRecentNote, validatedMostRecentNoteDate)
  describe("for one note", () => {
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
    it.only("should return an array with key and value of createdAt and noteText", () => {
      expect(getMostRecentNote(caseNote)).toBe(typeof Array)
    })
  })
})
