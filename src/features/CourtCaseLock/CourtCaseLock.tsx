import ConditionalRender from "components/ConditionalRender"
import { ErrorSummary, Paragraph } from "govuk-react"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
  lockedByAnotherUser: boolean
}

const CourtCaseLock: React.FC<Props> = ({ courtCase, lockedByAnotherUser }) => {
  const isLocked = !!courtCase.errorLockedByUsername || !!courtCase.triggerLockedByUsername

  return (
    <>
      <ConditionalRender isRendered={lockedByAnotherUser}>
        <ErrorSummary heading="Case locked by another user" />
      </ConditionalRender>
      <ConditionalRender isRendered={isLocked}>
        <Paragraph>{`Trigger locked by: ${courtCase.triggerLockedByUsername}`}</Paragraph>
        <Paragraph>{`Error locked by: ${courtCase.errorLockedByUsername}`}</Paragraph>
      </ConditionalRender>
    </>
  )
}

export default CourtCaseLock
