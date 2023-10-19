import CaseUnlockedTag from "../tags/CaseUnlockedTag"
import LockedByTag from "../tags/LockedByTag/LockedByTag"
import { SingleException } from "./CaseDetailsRow/SingleException"

export const ExceptionsReasonCell = ({ exceptionCounts }: { exceptionCounts: Record<string, number> }) => {
  return (
    <>
      {Object.keys(exceptionCounts).map((exception, exceptionId) => {
        return <SingleException key={exceptionId} exception={exception} exceptionCounter={exceptionCounts[exception]} />
      })}
    </>
  )
}

export const ExceptionsLockTag = ({
  csrfToken,
  errorLockedByFullName,
  canUnlockCase,
  unlockPath,
  exceptionsHaveBeenRecentlyUnlocked
}: {
  csrfToken: string
  errorLockedByUsername: string | null | undefined
  errorLockedByFullName: string | null | undefined
  canUnlockCase: boolean
  unlockPath: string
  exceptionsHaveBeenRecentlyUnlocked: boolean
}) => {
  return (
    <>
      <LockedByTag
        csrfToken={csrfToken}
        lockedBy={errorLockedByFullName}
        unlockPath={canUnlockCase ? unlockPath : undefined}
      />
      <CaseUnlockedTag isCaseUnlocked={exceptionsHaveBeenRecentlyUnlocked && !errorLockedByFullName} />
    </>
  )
}
