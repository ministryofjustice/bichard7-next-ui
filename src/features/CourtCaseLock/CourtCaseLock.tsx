import If from "components/If"
import { ErrorSummary, Link, Paragraph } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
  lockedByAnotherUser: boolean
}

const CourtCaseLock: React.FC<Props> = ({ courtCase, lockedByAnotherUser }) => {
  const { basePath, query } = useRouter()
  const lockCourtCasePath = (courtCaseId: string, lock: string) =>
    `${basePath}/court-cases/${courtCaseId}?${new URLSearchParams({ ...query, lock })}`
  const isLocked = !!courtCase.errorLockedById || !!courtCase.triggerLockedById

  return (
    <>
      <If condition={lockedByAnotherUser}>
        <ErrorSummary heading="Case locked by another user" />
      </If>
      <If condition={isLocked}>
        <Paragraph>{`Trigger locked by: ${courtCase.triggerLockedById}`}</Paragraph>
        <Paragraph>{`Error locked by: ${courtCase.errorLockedById}`}</Paragraph>
        <Link href={lockCourtCasePath(String(courtCase.errorId), "false")}>{"Unlock Court Case"}</Link>
      </If>
      <If condition={!isLocked}>
        <Link href={lockCourtCasePath(String(courtCase.errorId), "true")}>{"Lock Court Case"}</Link>
      </If>
    </>
  )
}

export default CourtCaseLock
