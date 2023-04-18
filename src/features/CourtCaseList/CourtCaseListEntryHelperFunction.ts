import Note from "../../services/entities/Note"
import { formatDisplayedDate } from "../../utils/formattedDate"

export const filterUserNotes = (notes: Note[]) => {
  const userNotes = notes.filter((note) => note.userId !== "System")
  return userNotes
}
export const getMostRecentNote = (userNotes: Note[]) =>
  userNotes.sort((noteA, noteB) => (noteA.createdAt > noteB.createdAt ? -1 : 1))[0]

export const validateMostRecentNoteDate = (mostRecentNote: Note) => {
  const mostRecentNoteDate = mostRecentNote.createdAt
  const formattedDate = formatDisplayedDate(new Date(mostRecentNoteDate.toString().slice(0, 10)))
  return formattedDate
}
