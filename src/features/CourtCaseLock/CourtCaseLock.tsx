import If from "components/If"
import { ErrorSummary, Paragraph } from "govuk-react"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
  lockedByAnotherUser: boolean
  errorMessage: string
}

const CourtCaseLock: React.FC<Props> = ({ courtCase, errorMessage }) => (
  <>
    <If condition={!!errorMessage}>
      <ErrorSummary heading={errorMessage} />
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
