import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import { DataSource } from "typeorm"
import sendToQueue from "services/mq/sendToQueue"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/build/src/serialise/ahoXml/generate"
import { isError } from "types/Result"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"
import PromiseResult from "types/PromiseResult"
import insertNotes from "services/insertNotes"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"

const resubmitCourtCase = async (
  dataSource: DataSource,
  form: Partial<Amendments>,
  courtCaseId: number,
  currentUser: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  try {
    const lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser)

    if (isError(lockResult)) {
      throw lockResult
    }

    const courtCase = await dataSource.transaction(
      "SERIALIZABLE",
      async (entityManager): Promise<AnnotatedHearingOutcome | Error> => {
        const amendedCourtCase = await amendCourtCase(entityManager, form, courtCaseId, currentUser)

        if (isError(amendedCourtCase)) {
          throw amendedCourtCase
        }

        const addNoteResult = await insertNotes(entityManager, [
          {
            noteText: `${currentUser.username}: Portal Action: Resubmitted Message.`,
            errorId: courtCaseId,
            userId: "System"
          }
        ])

        if (isError(addNoteResult)) {
          throw addNoteResult
        }

        const statusResult = await updateCourtCaseStatus(entityManager, +courtCaseId, "Error", "Submitted", currentUser)

        if (isError(statusResult)) {
          return statusResult
        }

        const unlockResult = await updateLockStatusToUnlocked(entityManager, +courtCaseId, currentUser)

        if (isError(unlockResult)) {
          throw unlockResult
        }

        return amendedCourtCase
      }
    )

    if (isError(courtCase)) {
      throw courtCase
    }

    const generatedXml = convertAhoToXml(courtCase, false)
    const queueResult = await sendToQueue({ messageXml: generatedXml, queueName: "HEARING_OUTCOME_INPUT_QUEUE" })

    if (isError(queueResult)) {
      return queueResult
    }

    return courtCase
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when resubmitting court case with ID: ${courtCaseId}`)
  }
}

export default resubmitCourtCase
