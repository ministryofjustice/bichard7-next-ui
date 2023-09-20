import ConditionalRender from "components/ConditionalRender"
import { useRouter } from "next/router"
import { encode } from "querystring"
import CourtCase from "services/entities/CourtCase"
import Feature from "types/Feature"
import { CurrentUser } from "types/Users"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { useCustomStyles } from "../../../../styles/customStyles"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { ExceptionsLockTag, ExceptionsReasonCell } from "./ExceptionsColumns"
import { ExtraReasonRow } from "./ExtraReasonRow"
import { TriggersLockTag, TriggersReasonCell } from "./TriggersColumns"

interface Props {
  courtCase: CourtCase
  currentUser: CurrentUser
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
    return currentUser.hasAccessTo[Feature.UnlockOtherUsersCases] || currentUser.username === lockedUsername
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
  if (hasExceptions && currentUser.hasAccessTo[Feature.Exceptions]) {
    reasonAndLockTags.push([exceptionsReasonCell, exceptionsLockTag])
  }
  if (hasTriggers && currentUser.hasAccessTo[Feature.Triggers]) {
    reasonAndLockTags.push([triggersReasonCell, triggersLockTag])
  }

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
