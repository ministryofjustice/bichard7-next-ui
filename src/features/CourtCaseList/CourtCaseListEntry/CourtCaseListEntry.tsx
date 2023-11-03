import ConditionalRender from "components/ConditionalRender"
import { useRouter } from "next/router"
import { encode } from "querystring"
import Permission from "types/Permission"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { useCustomStyles } from "../../../../styles/customStyles"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { ExceptionsLockTag, ExceptionsReasonCell } from "./ExceptionsColumns"
import { ExtraReasonRow } from "./ExtraReasonRow"
import { TriggersLockTag, TriggersReasonCell } from "./TriggersColumns"

interface Props {
  csrfToken: string
  courtCase: DisplayPartialCourtCase
  currentUser: DisplayFullUser
  exceptionHasBeenRecentlyUnlocked: boolean
  triggerHasBeenRecentlyUnlocked: boolean
  entityClassName: string
  previousPath: string | null
}

const CourtCaseListEntry: React.FC<Props> = ({
  csrfToken,
  entityClassName,
  courtCase,
  currentUser,
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
      csrfToken={csrfToken}
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
      csrfToken={csrfToken}
    />
  )
  const reasonAndLockTags: [JSX.Element, JSX.Element][] = []
  if (hasExceptions && currentUser.hasAccessTo[Permission.Exceptions]) {
    reasonAndLockTags.push([exceptionsReasonCell, exceptionsLockTag])
  }
  if (hasTriggers && currentUser.hasAccessTo[Permission.Triggers]) {
    reasonAndLockTags.push([triggersReasonCell, triggersLockTag])
  }

  const classes = useCustomStyles()

  return (
    <>
      <CaseDetailsRow
        canCurrentUserUnlockCase={errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
        hasTriggers={hasTriggers}
        courtDate={courtDate ? new Date(courtDate) : null}
        courtName={courtName}
        defendantName={defendantName}
        errorId={errorId}
        errorLockedByUsername={errorLockedByUsername}
        errorLockedByUserFullName={errorLockedByUserFullName}
        errorReport={errorReport}
        firstColumnClassName={hasTriggers ? classes["limited-border-left"] : ""}
        isCaseUnlocked={exceptionHasBeenRecentlyUnlocked && !errorLockedByUsername}
        isResolved={resolutionTimestamp !== null}
        isUrgent={isUrgent}
        notes={notes}
        ptiurn={ptiurn}
        rowClassName={entityClassName}
        unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
        reasonCell={reasonAndLockTags[0] ? reasonAndLockTags[0][0] : <></>}
        lockTag={reasonAndLockTags[0] ? reasonAndLockTags[0][1] : <></>}
        previousPath={previousPath}
      />
      <ConditionalRender isRendered={reasonAndLockTags.length > 1}>
        <ExtraReasonRow
          firstColumnClassName={classes["limited-border-left"]}
          rowClassName={entityClassName}
          isLocked={!!triggerLockedByUsername}
          reasonCell={reasonAndLockTags[1] ? reasonAndLockTags[1][0] : <></>}
          lockTag={reasonAndLockTags[1] ? reasonAndLockTags[1][1] : <></>}
        />
      </ConditionalRender>
    </>
  )
}

export default CourtCaseListEntry
