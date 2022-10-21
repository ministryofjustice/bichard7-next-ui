import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
// import updateCaseErrorStatus from "services/updateCaseErrorStatus"
import { DataSource } from "typeorm"
import { isError } from "types/Result"

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"
import PromiseResult from "types/PromiseResult"
import insertNotes from "services/insertNotes"
const resubmitCourtCase = async (
  dataSource: DataSource,
  form: Partial<Amendments>,
  courtCaseId: number,
  currentUser: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  try {
    return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
      const lockResult = await tryToLockCourtCase(entityManager, +courtCaseId, currentUser)

      if (isError(lockResult)) {
        throw lockResult
      }

      const amendedCourtCase = await amendCourtCase(form, courtCaseId, currentUser, entityManager)

      if (isError(amendedCourtCase)) {
        throw amendedCourtCase
      }

      const addNoteResult = await insertNotes(entityManager, [
        {
          noteText: "Bichard01: Portal Action: Resubmitted Message.",
          errorId: courtCaseId,
          userId: "System"
        }
      ])

      if (isError(addNoteResult)) {
        throw addNoteResult
      }

      // TODO: set error status as submitted = 3
      // TODO: Set the status on the record -- see ScreenFlowImpl.java -> submitResolvedError -> line 872
      // const statusResult = await updateCaseErrorStatus(entityManager, +courtCaseId, "Submitted", currentUser)

      // if (isError(statusResult)) {
      //   return statusResult
      // }

      const unlockResult = await unlockCourtCase(entityManager, +courtCaseId, currentUser)

      if (isError(unlockResult)) {
        throw unlockResult
      }

      return amendedCourtCase
    })
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when resubmitting court case with ID: ${courtCaseId}`)
  }
}

export default resubmitCourtCase
