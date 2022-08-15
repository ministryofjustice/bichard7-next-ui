import If from "components/If"
import { Button, ErrorSummary, Paragraph } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
  lockedByAnotherUser: boolean
}

const CourtCaseLock: React.FC<Props> = ({ courtCase, lockedByAnotherUser }) => {
  const { basePath, query } = useRouter()
  const getLockCourtCasePath = (courtCaseId: string, lock: string) =>
    `${basePath}/court-cases/${courtCaseId}?${new URLSearchParams({ ...query, lock })}`

  const isLocked = !!courtCase.errorLockedById || !!courtCase.triggerLockedById
  const lockCourtCasePath = getLockCourtCasePath(String(courtCase.errorId), String(!isLocked))
  const lockButtonTitle = isLocked ? "Unlock Court Case" : "Lock Court Case"

  return (
    <>
      <If condition={lockedByAnotherUser}>
        <ErrorSummary heading="Case locked by another user" />
      </If>
      <If condition={isLocked}>
        <Paragraph>{`Trigger locked by: ${courtCase.triggerLockedById}`}</Paragraph>
        <Paragraph>{`Error locked by: ${courtCase.errorLockedById}`}</Paragraph>
      </If>
      <form method="POST" action={lockCourtCasePath}>
        <Button buttonColour="#1d70b8">{lockButtonTitle}</Button>
      </form>
    </>
  )
}

export default CourtCaseLock
