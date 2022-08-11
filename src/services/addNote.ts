import { DataSource } from "typeorm"
import { isError } from "types/Result"
import { ServiceResultPromise } from "types/ServiceResult"
import CourtCase from "./entities/CourtCase"
import Note from "./entities/Note"

const MaxNoteLength = 1000
const notesRegex = new RegExp(`(.{1,${MaxNoteLength}})`, "g")

const addNote = async (
  dataSource: DataSource,
  courtCaseId: number,
  userId: string,
  noteText: string
): ServiceResultPromise => {
  if (!noteText) {
    return { isSuccessful: false, ValidationException: "Note text cannot be empty" }
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const courtCase = await courtCaseRepository.findOneBy({ errorId: courtCaseId })
  if (!courtCase) {
    return {
      isSuccessful: false,
      ValidationException: "Case not found"
    }
  }

  if (
    (courtCase.errorLockedById && courtCase.errorLockedById !== userId) ||
    (courtCase.triggerLockedById && courtCase.triggerLockedById !== userId)
  ) {
    return {
      isSuccessful: false,
      ValidationException: "Case is locked by another user"
    }
  }

  const noteRepository = dataSource.getRepository(Note)
  const addNoteResult = await noteRepository
    .createQueryBuilder()
    .insert()
    .into(Note)
    .values(
      noteText.match(notesRegex)?.map((text) => ({
        createdAt: new Date(),
        noteText: text,
        errorId: courtCaseId,
        userId
      })) ?? []
    )
    .execute()
    .catch((error: Error) => error)

  if (isError(addNoteResult)) {
    console.error(addNoteResult)
    return { isSuccessful: false, Exception: addNoteResult }
  }

  return { isSuccessful: true }
}

export default addNote
