import { useRouter } from "next/router"
import { encode } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import { useCustomStyles } from "../../../../styles/customStyles"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { ExtraReasonRow } from "./ExtraReasonRow"
import Feature from "types/Feature"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import ConditionalRender from "components/ConditionalRender"
import { TriggersLockTag, TriggersReasonCell } from "./TriggersColumns"
import { ExceptionsLockTag, ExceptionsReasonCell } from "./ExceptionsColumns"

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
        reasonCell={<ExceptionsReasonCell exceptionCounts={groupErrorsFromReport(errorReport)} />}
        lockTag={
          <ExceptionsLockTag
            errorLockedByUsername={errorLockedByUsername}
            errorLockedByFullName={errorLockedByUserFullName}
            canUnlockCase={!!errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
            unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
          />
        }
      />
      <ConditionalRender isRendered={hasTriggers}>
        <ExtraReasonRow
          firstColumnClassName={classes["limited-border-left"]}
          rowClassName={entityClassName}
          isLocked={!!triggerLockedByUsername}
          reasonCell={<TriggersReasonCell triggers={triggers} />}
          lockTag={
            <TriggersLockTag
              triggersLockedByUsername={triggerLockedByUsername}
              triggersLockedByFullName={triggerLockedByUserFullName}
              triggersHaveBeenRecentlyUnlocked={triggerHasBeenRecentlyUnlocked}
              canUnlockCase={!!triggerLockedByUsername && canUnlockCase(triggerLockedByUsername)}
              unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
            />
          }
        />
      </ConditionalRender>
    </>
  )
}

export default CourtCaseListEntry
