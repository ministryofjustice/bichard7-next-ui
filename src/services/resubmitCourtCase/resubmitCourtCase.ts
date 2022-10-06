import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
// import updateCaseErrorStatus from "services/updateCaseErrorStatus"
import { DataSource } from "typeorm"
import { isError } from "types/Result"

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

const resubmitCourtCase = async (
  dataSource: DataSource,
  form: Partial<Amendments>,
  courtCaseId: number,
  currentUser: User
): Promise<AnnotatedHearingOutcome | Error> => {
  const lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser)

  if (isError(lockResult)) {
    throw lockResult
  }

  const amendedCourtCase = await amendCourtCase(form, courtCaseId, currentUser, dataSource)

  if (isError(amendedCourtCase)) {
    return amendedCourtCase
  }

  // TODO: set error status as submitted = 3
  // TODO: Set the status on the record -- see ScreenFlowImpl.java -> submitResolvedError -> line 872
  // const statusResult = await updateCaseErrorStatus(dataSource, +courtCaseId, "Submitted", currentUser)

  // if (isError(statusResult)) {
  //   return statusResult
  // }

  const unlockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser)

  if (isError(unlockResult)) {
    return unlockResult
  }

  return amendedCourtCase
}

export default resubmitCourtCase
