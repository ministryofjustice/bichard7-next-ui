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
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  currentUser,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked
}: Props) => {
  const {
    errorId,
    courtDate,
    ptiurn,
    defendantName,
    courtName,
    triggers,
    errorReport,
    isUrgent,
    errorLockedByUsername,
    triggerLockedByUsername,
    resolutionTimestamp,
    notes
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
        isCaseUnlocked={triggerHasBeenRecentlyUnlocked && !errorLockedByUsername}
        triggerLockedByUsername={triggerLockedByUsername}
        triggers={triggers}
        unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
      />
    </>
  )
}

export default CourtCaseListEntry
