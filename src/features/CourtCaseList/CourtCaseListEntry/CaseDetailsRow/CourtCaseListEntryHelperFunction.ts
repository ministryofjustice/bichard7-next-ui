import { DisplayPartialNote } from "types/display/Notes"
import { formatDisplayedDate } from "../../../../utils/formattedDate"

export const validateMostRecentNoteDate = (mostRecentNote: DisplayPartialNote) => {
  const mostRecentNoteDate = mostRecentNote.createdAt
  const formattedDate = formatDisplayedDate(new Date(mostRecentNoteDate.toString().slice(0, 10)))
  return formattedDate
}
