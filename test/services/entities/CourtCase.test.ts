import { expect } from "@jest/globals"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"

describe("CourtCase", () => {
  it("should be locked by another user when error is locked by another user", () => {
    const courtCase = new CourtCase()
    courtCase.errorLockedByUsername = "Another username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(true)
  })

  it("should be locked by another user when trigger is locked by another user", () => {
    const courtCase = new CourtCase()
    courtCase.triggerLockedByUsername = "Another username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(true)
  })

  it("should not be locked by another user when error is locked by the user", () => {
    const courtCase = new CourtCase()
    courtCase.errorLockedByUsername = "username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("should not be locked by another user when trigger is locked by the user", () => {
    const courtCase = new CourtCase()
    courtCase.triggerLockedByUsername = "username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("should not be locked by another user when error and trigger are not locked by any user", () => {
    const courtCase = new CourtCase()
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("should return the correct user note count with no notes set", () => {
    const courtCase = new CourtCase()
    const result = courtCase.countUserNotes()

    expect(result).toBe(0)
  })
  it("should return the correct user note count with only system notes", () => {
    const courtCase = new CourtCase()

    const systemNote: Note = {
      errorId: courtCase.errorId,
      userId: "System",
      noteText: "Test note"
    } as unknown as Note

    courtCase.notes = [systemNote, systemNote, systemNote]

    const result = courtCase.countUserNotes()

    expect(result).toBe(0)
  })
  it("should return the correct user note count with only user notes", () => {
    const courtCase = new CourtCase()

    const userNote1: Note = {
      errorId: courtCase.errorId,
      userId: "test_user_1",
      noteText: "Test note"
    } as unknown as Note

    const userNote2: Note = {
      errorId: courtCase.errorId,
      userId: "test_user_2",
      noteText: "Test note"
    } as unknown as Note

    courtCase.notes = [userNote1, userNote2, userNote1]

    const result = courtCase.countUserNotes()

    expect(result).toBe(3)
  })
  it("should return the correct user note count with user and system notes", () => {
    const courtCase = new CourtCase()

    const systemNote: Note = {
      errorId: courtCase.errorId,
      userId: "System",
      noteText: "Test note"
    } as unknown as Note

    const userNote: Note = {
      errorId: courtCase.errorId,
      userId: "test_user_1",
      noteText: "Test note"
    } as unknown as Note

    courtCase.notes = [systemNote, userNote, userNote, systemNote]

    const result = courtCase.countUserNotes()

    expect(result).toBe(2)
  })
})
