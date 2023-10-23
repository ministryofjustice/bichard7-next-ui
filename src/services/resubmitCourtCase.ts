import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import { DataSource } from "typeorm"
import sendToQueue from "services/mq/sendToQueue"
import { isError } from "types/Result"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"
import PromiseResult from "types/PromiseResult"
import insertNotes from "services/insertNotes"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import UnlockReason from "types/UnlockReason"
import updateLockStatusToLocked from "services/updateLockStatusToLocked"
import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/core/phase1/serialise/ahoXml/generate"

const resubmitCourtCase = async (
  dataSource: DataSource,
  form: Partial<Amendments>,
  courtCaseId: number,
  user: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  try {
    const resultAho = await dataSource.transaction(
      "SERIALIZABLE",
      async (entityManager): Promise<AnnotatedHearingOutcome | Error> => {
        const events: AuditLogEvent[] = []

        const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

        if (isError(courtCase)) {
          throw courtCase
        }

        if (!courtCase) {
          throw new Error("Failed to resubmit: Case not found")
        }

        const lockResult = await updateLockStatusToLocked(entityManager, +courtCaseId, user, events)
        if (isError(lockResult)) {
          throw lockResult
        }

        const amendedCourtCase = await amendCourtCase(entityManager, form, courtCase, user)

        if (isError(amendedCourtCase)) {
          throw amendedCourtCase
        }

        const addNoteResult = await insertNotes(entityManager, [
          {
            noteText: `${user.username}: Portal Action: Resubmitted Message.`,
            errorId: courtCaseId,
            userId: "System"
          }
        ])

        if (isError(addNoteResult)) {
          throw addNoteResult
        }

        const statusResult = await updateCourtCaseStatus(entityManager, courtCase, "Error", "Submitted", user)

        if (isError(statusResult)) {
          return statusResult
        }

        const unlockResult = await updateLockStatusToUnlocked(
          entityManager,
          courtCase,
          user,
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
