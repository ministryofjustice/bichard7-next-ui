import { useCurrentUser } from "context/CurrentUserContext"
import { useRouter } from "next/router"
import { encode } from "querystring"
import Permission from "types/Permission"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { ExceptionsLockTag, ExceptionsReasonCell } from "./ExceptionsColumns"
import { ExtraReasonRow } from "./ExtraReasonRow"
import { TriggersLockTag, TriggersReasonCell } from "./TriggersColumns"

interface Props {
  courtCase: DisplayPartialCourtCase
  exceptionHasBeenRecentlyUnlocked: boolean
  triggerHasBeenRecentlyUnlocked: boolean
  previousPath: string | null
  reasonCode: string | null
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked,
  previousPath,
  reasonCode
}: Props) => {
  const {
    errorId,
    errorLockedByUsername,
    errorLockedByUserFullName,
    errorReport,
    triggerLockedByUsername,
    triggerLockedByUserFullName,
    triggers,
    errorStatus
  } = courtCase

  const { basePath, query } = useRouter()
  const searchParams = new URLSearchParams(encode(query))
  const currentUser = useCurrentUser()

  const unlockCaseWithReasonPath = (reason: "Trigger" | "Exception", caseId: string) => {
    deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

    searchParams.append(`unlock${reason}`, caseId)
    return `${basePath}/?${searchParams}`
  }

  const canUnlockCase = (lockedUsername: string): boolean => {
    return currentUser.hasAccessTo[Permission.UnlockOtherUsersCases] || currentUser.username === lockedUsername
  }

  const hasTriggers = triggers.length > 0
  const hasExceptions = !!errorReport

  let exceptionsReasonCell, exceptionsLockTag, triggersReasonCell, triggersLockTag
  if (hasExceptions && currentUser.hasAccessTo[Permission.Exceptions]) {
    exceptionsReasonCell = <ExceptionsReasonCell exceptionCounts={groupErrorsFromReport(errorReport)} />
    exceptionsLockTag = (
      <ExceptionsLockTag
        errorLockedByUsername={errorLockedByUsername}
        errorLockedByFullName={errorLockedByUserFullName}
        canUnlockCase={!!errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
        exceptionsHaveBeenRecentlyUnlocked={exceptionHasBeenRecentlyUnlocked}
      />
    )
  }
  if (hasTriggers && currentUser.hasAccessTo[Permission.Triggers]) {
    triggersReasonCell = <TriggersReasonCell triggers={triggers} />
    triggersLockTag = (
      <TriggersLockTag
        triggersLockedByUsername={triggerLockedByUsername}
        triggersLockedByFullName={triggerLockedByUserFullName}
        triggersHaveBeenRecentlyUnlocked={triggerHasBeenRecentlyUnlocked}
        canUnlockCase={!!triggerLockedByUsername && canUnlockCase(triggerLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
      />
    )
  }

  return (
    <tbody>
      <CaseDetailsRow
        courtCase={courtCase}
        reasonCell={reasonCode || exceptionsReasonCell || triggersReasonCell}
        lockTag={exceptionsLockTag || triggersLockTag}
        resolutionStatus={errorStatus ?? "Unresolved"}
        previousPath={previousPath}
      />
      {!reasonCode && exceptionsLockTag && triggersLockTag && triggersReasonCell && (
        <ExtraReasonRow
          isLocked={!!triggerLockedByUsername}
          reasonCell={triggersReasonCell}
          lockTag={triggersLockTag}
        />
      )}
    </tbody>
  )
}

export default CourtCaseListEntry
