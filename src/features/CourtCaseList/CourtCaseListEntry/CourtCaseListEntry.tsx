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
import { SingleException } from "./CaseDetailsRow/SingleException"
import LockedByTag from "../tags/LockedByTag/LockedByTag"
import Trigger from "services/entities/Trigger"
import ConditionalRender from "components/ConditionalRender"
import CaseUnlockedTag from "../tags/CaseUnlockedTag"

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

  const exceptions = groupErrorsFromReport(errorReport)
  const exceptionsCell = (
    <>
      {Object.keys(exceptions).map((exception, exceptionId) => {
        return <SingleException key={exceptionId} exception={exception} exceptionCounter={exceptions[exception]} />
      })}
    </>
  )
  const exceptionsLockTag =
    errorLockedByUsername && canUnlockCase(errorLockedByUsername) ? (
      <LockedByTag
        lockedBy={errorLockedByUserFullName}
        unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
      />
    ) : (
      <LockedByTag lockedBy={errorLockedByUserFullName} />
    )

  type TriggerWithCount = Partial<Trigger> & { count: number }
  const triggersWithCounts = Object.values(
    triggers.reduce(
      (counts, trigger) => {
        let current = counts[trigger.triggerCode]
        if (!current) {
          current = { ...trigger, count: 1 }
        } else {
          current.count += 1
        }

        counts[trigger.triggerCode] = current
        return counts
      },
      {} as { [key: string]: TriggerWithCount }
    )
  )
  const triggersCell = triggersWithCounts?.map((trigger, triggerId) => (
    <div key={`trigger_${triggerId}`} className={"trigger-description"}>
      {trigger.description}
      <ConditionalRender isRendered={trigger.count > 1}>
        <b>{` (${trigger.count})`}</b>
      </ConditionalRender>
    </div>
  ))
  const triggersLockTag = (
    <>
      {triggerLockedByUsername && canUnlockCase(triggerLockedByUsername) ? (
        <LockedByTag
          lockedBy={triggerLockedByUserFullName}
          unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
        />
      ) : (
        <LockedByTag lockedBy={triggerLockedByUserFullName} />
      )}

      <CaseUnlockedTag isCaseUnlocked={triggerHasBeenRecentlyUnlocked && !triggerLockedByUsername} />
    </>
  )

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
        reasonCell={exceptionsCell}
        lockTag={exceptionsLockTag}
      />
      <ConditionalRender isRendered={hasTriggers}>
        <ExtraReasonRow
          firstColumnClassName={classes["limited-border-left"]}
          rowClassName={entityClassName}
          isLocked={!!triggerLockedByUsername}
          reasonCell={triggersCell}
          lockTag={triggersLockTag}
        />
      </ConditionalRender>
    </>
  )
}

export default CourtCaseListEntry
