import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import { DataSource } from "typeorm"

const resubmitCourtCase = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any,
  courtCaseId: number,
  lockException: boolean,
  lockTrigger: boolean,
  userDetails: User,
  dataSource: DataSource
) => {
  // TODO: Only amend the case if the case is unlocked (the case locked status is sent over by the form)
  // If its not unlocked add is locked by someone else, return a message to the user that it cant be updated
  const amendedCase = amendCourtCase(form.updates, courtCaseId, userDetails, dataSource)
  console.log(amendedCase, lockTrigger, lockException)
}

export default resubmitCourtCase
