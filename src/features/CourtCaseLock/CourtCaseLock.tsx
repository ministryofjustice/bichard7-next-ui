import ConditionalRender from "components/ConditionalRender"
import { Button, ErrorSummary, Paragraph } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import { navy } from "utils/colours"

interface Props {
  courtCase: CourtCase
  lockedByAnotherUser: boolean
}

const CourtCaseLock: React.FC<Props> = ({ courtCase, lockedByAnotherUser }) => {
  const { basePath, query } = useRouter()
  const getLockCourtCasePath = (courtCaseId: string, lock: string) =>
    `${basePath}/court-cases/${courtCaseId}?${new URLSearchParams({ ...query, lock })}`

  const isLocked = !!courtCase.errorLockedByUsername || !!courtCase.triggerLockedByUsername
  const lockCourtCasePath = getLockCourtCasePath(String(courtCase.errorId), String(!isLocked))
  const lockButtonTitle = isLocked ? "Unlock Court Case" : "Lock Court Case"

  return (
    <>
      <ConditionalRender isRendered={lockedByAnotherUser}>
        <ErrorSummary heading="Case locked by another user" />
      </ConditionalRender>
      <ConditionalRender isRendered={isLocked}>
        <Paragraph>{`Trigger locked by: ${courtCase.triggerLockedByUsername}`}</Paragraph>
        <Paragraph>{`Error locked by: ${courtCase.errorLockedByUsername}`}</Paragraph>
      </ConditionalRender>
      <form method="POST" action={lockCourtCasePath}>
        <Button buttonColour={navy}>{lockButtonTitle}</Button>
      </form>
    </>
  )
}

export default CourtCaseLock
