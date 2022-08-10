import If from "components/If"
import { ErrorSummary, Paragraph } from "govuk-react"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
  lockedByAnotherUser: boolean
}

const CourtCaseLock: React.FC<Props> = ({ courtCase, lockedByAnotherUser }) => (
  <>
    <If condition={lockedByAnotherUser}>
      <ErrorSummary heading="Case locked by another user" />
    </If>
    <If condition={!!courtCase?.triggerLockedById}>
      <Paragraph>{`Trigger locked by: ${courtCase.triggerLockedById}`}</Paragraph>
    </If>
    <If condition={!!courtCase?.errorLockedById}>
      <Paragraph>{`Error locked by: ${courtCase.errorLockedById}`}</Paragraph>
    </If>
  </>
)

export default CourtCaseLock
