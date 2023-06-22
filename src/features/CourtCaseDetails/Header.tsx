import UrgentBadge from "features/CourtCaseList/tags/UrgentBadge"
import { Heading } from "govuk-react"
import CourtCase from "services/entities/CourtCase"

interface Props {
  courtCase: CourtCase
}

const Header: React.FC<Props> = ({ courtCase }: Props) => {
  return (
    <>
      <Heading as="h1" size="LARGE" className="govuk-!-font-weight-regular">
        {"Case details"}
      </Heading>
      <Heading as="h2" size="MEDIUM" className="govuk-!-font-weight-regular">
        {courtCase.defendantName}
        <UrgentBadge
          isUrgent={courtCase.isUrgent}
          className="govuk-!-static-margin-left-5 govuk-!-font-weight-regular"
        />
      </Heading>
    </>
  )
}

export default Header
