import Note from "services/entities/Note"
import { DisplayNote, DisplayPartialNote } from "types/display/Notes"
import { userToDisplayPartialUserDto } from "./userDto"

export const noteToDisplayPartialNoteDto = (noteText: string, createdAt: Date): DisplayPartialNote => {
  const displayPartialNote: DisplayPartialNote = {
    noteText,
    createdAt: createdAt.toISOString()
  }

  return displayPartialNote
}

export const noteToDisplayNoteDto = (note: Note): DisplayNote => {
  const displayNote: DisplayNote = {
    noteText: note.noteText,
    createdAt: note.createdAt.toISOString(),
    userId: note.userId
  }

  if (note.userFullName) {
    displayNote.userFullName = note.userFullName
  }

  if (note.user && note.user.username) {
    displayNote.user = userToDisplayPartialUserDto(note.user)
  }

  return displayNote
}
