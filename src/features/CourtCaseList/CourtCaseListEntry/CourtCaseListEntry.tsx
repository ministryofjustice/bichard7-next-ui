import { useRouter } from "next/router"
import { encode } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { TriggersRow } from "./TriggersRow/TriggersRow"

interface Props {
  courtCase: CourtCase
  currentUser: User
  exceptionHasBeenRecentlyUnlocked: boolean
  triggerHasBeenRecentlyUnlocked: boolean
  rowsClassname: string
}

const CourtCaseListEntry: React.FC<Props> = ({
  rowsClassname,
  courtCase,
  currentUser,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked,
}: Props) => {
  const {
    courtDate,
    courtName,
    defendantName,
    errorId,
    errorLockedByUsername,
    errorReport,
    isUrgent,
    notes,
    ptiurn,
    resolutionTimestamp,
    triggerLockedByUsername,
    triggers
  } = courtCase
  const { basePath, query } = useRouter()
  const searchParams = new URLSearchParams(encode(query))
  const unlockCaseWithReasonPath = (reason: "Trigger" | "Exception", caseId: string) => {
    deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

    searchParams.append(`unlock${reason}`, caseId)
    return `${basePath}/?${searchParams}`
  }
  const canUnlockCase = (lockedUsername: string): boolean => {
    return currentUser.groups.includes("Supervisor") || currentUser.username === lockedUsername
  }

  return (
    <>
      <CaseDetailsRow
        canCurrentUserUnlockCase={errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
        classname={rowsClassname}
        courtDate={courtDate}
        courtName={courtName}
        defendantName={defendantName}
        errorId={errorId}
        errorLockedByUsername={errorLockedByUsername}
        errorReport={errorReport}
        isCaseUnlocked={exceptionHasBeenRecentlyUnlocked && !errorLockedByUsername}
        isResolved={resolutionTimestamp !== null}
        isUrgent={isUrgent}
        notes={notes}
        ptiurn={ptiurn}
        unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
      />
      <TriggersRow
        canCurrentUserUnlockCase={triggerLockedByUsername && canUnlockCase(triggerLockedByUsername)}
        classname={rowsClassname}
        isCaseUnlocked={triggerHasBeenRecentlyUnlocked && !errorLockedByUsername}
        triggerLockedByUsername={triggerLockedByUsername}
        triggers={triggers}
        unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
      />
    </>
  )
}

export default CourtCaseListEntry
