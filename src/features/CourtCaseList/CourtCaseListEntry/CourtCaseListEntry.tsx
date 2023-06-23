import { useRouter } from "next/router"
import { encode } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import { useCustomStyles } from "../../../../styles/customStyles"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { TriggersRow } from "./TriggersRow/TriggersRow"
import { Groups } from "types/GroupName"

interface Props {
  courtCase: CourtCase
  currentUser: User
  exceptionHasBeenRecentlyUnlocked: boolean
  triggerHasBeenRecentlyUnlocked: boolean
  entityClassName: string
}

const CourtCaseListEntry: React.FC<Props> = ({
  entityClassName,
  courtCase,
  currentUser,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked
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
    return currentUser.groups.includes(Groups.Supervisor) || currentUser.username === lockedUsername
  }

  const hasTriggers = triggers.length > 0

  const classes = useCustomStyles()

  return (
    <>
      <CaseDetailsRow
        canCurrentUserUnlockCase={errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
        hasTriggers={hasTriggers}
        courtDate={courtDate}
        courtName={courtName}
        defendantName={defendantName}
        errorId={errorId}
        errorLockedByUsername={errorLockedByUsername}
        errorReport={errorReport}
        firstColumnClassName={hasTriggers ? classes["limited-border-left"] : ""}
        isCaseUnlocked={exceptionHasBeenRecentlyUnlocked && !errorLockedByUsername}
        isResolved={resolutionTimestamp !== null}
        isUrgent={isUrgent}
        notes={notes}
        ptiurn={ptiurn}
        rowClassName={entityClassName}
        unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
      />
      <TriggersRow
        canCurrentUserUnlockCase={triggerLockedByUsername && canUnlockCase(triggerLockedByUsername)}
        firstColumnClassName={hasTriggers ? classes["limited-border-left"] : ""}
        isCaseUnlocked={triggerHasBeenRecentlyUnlocked && !triggerLockedByUsername}
        rowClassName={entityClassName}
        triggerLockedByUsername={triggerLockedByUsername}
        triggers={triggers}
        unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
      />
    </>
  )
}

export default CourtCaseListEntry
