import KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import { SingleException } from "./CaseDetailsRow/SingleException"
import LockedByTag from "../tags/LockedByTag/LockedByTag"
import CaseUnlockedTag from "../tags/CaseUnlockedTag"

export const ExceptionsReasonCell = ({ exceptionCounts }: { exceptionCounts: KeyValuePair<string, number> }) => {
  return (
    <>
      {Object.keys(exceptionCounts).map((exception, exceptionId) => {
        return <SingleException key={exceptionId} exception={exception} exceptionCounter={exceptionCounts[exception]} />
      })}
    </>
  )
}

export const ExceptionsLockTag = ({
  errorLockedByFullName,
  canUnlockCase,
  unlockPath,
  exceptionsHaveBeenRecentlyUnlocked
}: {
  errorLockedByUsername: string | null | undefined
  errorLockedByFullName: string | null | undefined
  canUnlockCase: boolean
  unlockPath: string
  exceptionsHaveBeenRecentlyUnlocked: boolean
}) => {
  const lockTag = canUnlockCase ? (
    <LockedByTag lockedBy={errorLockedByFullName} unlockPath={unlockPath} />
  ) : (
    <LockedByTag lockedBy={errorLockedByFullName} />
  )
  return (
    <>
      {lockTag}
      <CaseUnlockedTag isCaseUnlocked={exceptionsHaveBeenRecentlyUnlocked && !errorLockedByFullName} />
    </>
  )
}
