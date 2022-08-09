import If from "components/If"
import { Paragraph } from "govuk-react"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
}

const CourtCaseLock: React.FC<Props> = ({ courtCase }) => (
  <>
    <If condition={!!courtCase?.triggerLockedById}>
      <Paragraph>{`Trigger locked by: ${courtCase.triggerLockedById}`}</Paragraph>
    </If>
    <If condition={!!courtCase?.errorLockedById}>
      <Paragraph>{`Error locked by: ${courtCase.errorLockedById}`}</Paragraph>
    </If>
  </>
)

export default CourtCaseLock
