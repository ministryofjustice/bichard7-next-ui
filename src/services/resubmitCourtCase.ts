import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import { DataSource } from "typeorm"
import sendToQueue from "services/mq/sendToQueue"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/dist/serialise/ahoXml/generate"
import { isError } from "types/Result"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"
import PromiseResult from "types/PromiseResult"
import insertNotes from "services/insertNotes"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import UnlockReason from "types/UnlockReason"
import updateLockStatusToLocked from "services/updateLockStatusToLocked"
import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import getCourtCase from "./getCourtCase"

const resubmitCourtCase = async (
  dataSource: DataSource,
  form: Partial<Amendments>,
  courtCaseId: number,
  currentUser: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  try {
    const resultAho = await dataSource.transaction(
      "SERIALIZABLE",
      async (entityManager): Promise<AnnotatedHearingOutcome | Error> => {
        const events: AuditLogEvent[] = []

        const courtCase = await getCourtCase(entityManager, courtCaseId)

        if (isError(courtCase)) {
          throw courtCase
        }

        if (!courtCase) {
          throw new Error("Failed to resubmit: Case not found")
        }

        const lockResult = await updateLockStatusToLocked(entityManager, +courtCaseId, currentUser, events)
        if (isError(lockResult)) {
          throw lockResult
        }

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

        const unlockResult = await updateLockStatusToUnlocked(
          entityManager,
          courtCase,
          currentUser,
          UnlockReason.TriggerAndException,
          [] //TODO pass an actual audit log events array
        )

        if (isError(unlockResult)) {
          throw unlockResult
        }

        return amendedCourtCase
      }
    )

    if (isError(resultAho)) {
      throw resultAho
    }

    const generatedXml = convertAhoToXml(resultAho, false)
    const queueResult = await sendToQueue({ messageXml: generatedXml, queueName: "HEARING_OUTCOME_INPUT_QUEUE" })

    if (isError(queueResult)) {
      return queueResult
    }

    return resultAho
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when resubmitting court case with ID: ${courtCaseId}`)
  }
}

export default resubmitCourtCase
