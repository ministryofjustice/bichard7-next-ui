import ConditionalRender from "components/ConditionalRender"
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
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked,
  previousPath
}: Props) => {
  const {
    courtDate,
    courtName,
    defendantName,
    errorId,
    errorLockedByUsername,
    errorLockedByUserFullName,
    errorReport,
    isUrgent,
    notes,
    ptiurn,
    resolutionTimestamp,
    triggerLockedByUsername,
    triggerLockedByUserFullName,
    triggers
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

  const exceptionsReasonCell = <ExceptionsReasonCell exceptionCounts={groupErrorsFromReport(errorReport)} />
  const exceptionsLockTag = (
    <ExceptionsLockTag
      errorLockedByUsername={errorLockedByUsername}
      errorLockedByFullName={errorLockedByUserFullName}
      canUnlockCase={!!errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
      unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
      exceptionsHaveBeenRecentlyUnlocked={exceptionHasBeenRecentlyUnlocked}
    />
  )
  const triggersReasonCell = <TriggersReasonCell triggers={triggers} />
  const triggersLockTag = (
    <TriggersLockTag
      triggersLockedByUsername={triggerLockedByUsername}
      triggersLockedByFullName={triggerLockedByUserFullName}
      triggersHaveBeenRecentlyUnlocked={triggerHasBeenRecentlyUnlocked}
      canUnlockCase={!!triggerLockedByUsername && canUnlockCase(triggerLockedByUsername)}
      unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
    />
  )
  const reasonAndLockTags: [JSX.Element, JSX.Element][] = []
  if (hasExceptions && currentUser.hasAccessTo[Permission.Exceptions]) {
    reasonAndLockTags.push([exceptionsReasonCell, exceptionsLockTag])
  }
  if (hasTriggers && currentUser.hasAccessTo[Permission.Triggers]) {
    reasonAndLockTags.push([triggersReasonCell, triggersLockTag])
  }

  return (
    <tbody>
      <CaseDetailsRow
        courtDate={courtDate ? new Date(courtDate) : null}
        courtName={courtName}
        defendantName={defendantName}
        errorId={errorId}
        errorLockedByUsername={errorLockedByUsername}
        isResolved={resolutionTimestamp !== null}
        isUrgent={isUrgent}
        notes={notes}
        ptiurn={ptiurn}
        reasonCell={reasonAndLockTags[0]?.[0]}
        lockTag={reasonAndLockTags[0] ? reasonAndLockTags[0][1] : <></>}
        previousPath={previousPath}
      />
      <ConditionalRender isRendered={reasonAndLockTags.length > 1}>
        <ExtraReasonRow
          isLocked={!!triggerLockedByUsername}
          reasonCell={reasonAndLockTags[1] ? reasonAndLockTags[1][0] : <></>}
          lockTag={reasonAndLockTags[1] ? reasonAndLockTags[1][1] : <></>}
        />
      </ConditionalRender>
    </tbody>
  )
}

export default CourtCaseListEntry
