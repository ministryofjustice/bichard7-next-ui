import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import amendCourtCase from "services/amendCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import User from "services/entities/User"
import { isError } from "types/Result"
import { DataSource } from "typeorm"

const resubmitCourtCase = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource: DataSource,
  form: any,
  courtCaseId: number,
  currentUser: User
): Promise<AnnotatedHearingOutcome | Error> => {
  const lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser)

  if (isError(lockResult)) {
    throw lockResult
  }

  const amendedCase = await amendCourtCase(form, courtCaseId, currentUser, dataSource)

  if (isError(amendCourtCase)) {
    return amendCourtCase
  }

  const unlockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser)

  if (isError(unlockResult)) {
    return unlockResult
  }

  return amendedCase
}

export default resubmitCourtCase
