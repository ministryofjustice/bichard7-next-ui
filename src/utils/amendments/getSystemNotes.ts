import Note from "services/entities/Note"
import User from "services/entities/User"
import { Amendments } from "types/Amendments"
import { formatDisplayedDate } from "utils/formattedDate"

const formatValue = (value: string | number | boolean | Date): string =>
  value instanceof Date ? formatDisplayedDate(value) : `${value}`

const getSystemNotes = (amendments: Partial<Amendments>, userDetails: User, courtCaseId: number): Partial<Note>[] => {
  const notes: Partial<Note>[] = []
  const portalActionText = `${userDetails.username}: Portal Action: Update Applied.`

  for (const [key, value] of Object.entries(amendments)) {
    if (key === "noUpdatesResubmit") {
      continue
    }

    if (Array.isArray(value)) {
      value.forEach((field) => {
        notes.push({
          noteText: `${portalActionText} Element: ${key}. New Value: ${formatValue(field.updatedValue)}`,
          errorId: courtCaseId,
          userId: "System"
        })
      })
    } else {
      notes.push({
        noteText: `${portalActionText} Element: ${key}. New Value: ${formatValue(value)}`,
        errorId: courtCaseId,
        userId: "System"
      })
    }
  }
  return notes
}

export default getSystemNotes
