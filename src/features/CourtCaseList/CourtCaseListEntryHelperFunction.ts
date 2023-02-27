import { format } from "date-fns"
import Note from "services/entities/Note"
import { displayedDateFormat } from "utils/formattedDate"

export const getMostRecentNote = (userNotes: Note[]) => {
  console.log(userNotes)
  const createdAtDatesForAllNotes = userNotes.map((note) => note.createdAt)
  const mostRecentNoteDate = createdAtDatesForAllNotes.sort().slice(-1)[0]
  const mostRecentNote = userNotes.filter((note) => note.createdAt === mostRecentNoteDate)

  return mostRecentNote
}

export const first100CharsOfMostRecentNote = (userNotes: Note[]) => {
  const mostRecentNoteText = getMostRecentNote(userNotes)[0].noteText
  return mostRecentNoteText.length > 100 ? `${mostRecentNoteText.slice(0, 100)}...` : mostRecentNoteText
}

export const validatedMostRecentNoteDate = (mostRecentNote: Note[]) => {
  const mostRecentNoteDate = mostRecentNote[0].createdAt
  const formattedDate = format(new Date(mostRecentNoteDate.toString().slice(0, 10)), displayedDateFormat)
  return formattedDate
}
