import { format } from "date-fns"
import Note from "services/entities/Note"
import { displayedDateFormat } from "utils/formattedDate"

export const filterUserNotes = (notes: Note[]) => {
  const userNotes = notes.filter((note) => note.userId !== "System")
  return userNotes
}
export const getMostRecentNote = (userNotes: Note[]) => {
  const createdAtDatesForAllNotes = userNotes.map((note) => note.createdAt)
  const mostRecentNoteDate = createdAtDatesForAllNotes.sort().slice(-1)[0]
  const mostRecentNote = userNotes.filter((note) => note.createdAt === mostRecentNoteDate)

  return mostRecentNote
}

export const getFirst100CharsOfMostRecentNote = (mostRecentNote: Note[]) => {
  const mostRecentNoteText = mostRecentNote[0].noteText
  return mostRecentNoteText.length > 100 ? `${mostRecentNoteText.slice(0, 100)}...` : mostRecentNoteText
}

export const validateMostRecentNoteDate = (mostRecentNote: Note[]) => {
  const mostRecentNoteDate = mostRecentNote[0].createdAt
  const formattedDate = format(new Date(mostRecentNoteDate.toString().slice(0, 10)), displayedDateFormat)
  return formattedDate
}
