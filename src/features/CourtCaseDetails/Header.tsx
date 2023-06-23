import ConditionalRender from "components/ConditionalRender"
import UrgentBadge from "features/CourtCaseList/tags/UrgentBadge"
import { Button, Heading } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { isLockedByCurrentUser } from "utils/caseLocks"
import { gdsLightGrey, textPrimary } from "utils/colours"

interface Props {
  courtCase: CourtCase
  user: User
}

const Header: React.FC<Props> = ({ courtCase, user }: Props) => {
  const { basePath } = useRouter()

  const hasCaseLock = isLockedByCurrentUser(courtCase, user.username)
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
      <ConditionalRender isRendered={hasCaseLock}>
        <a href={basePath}>
          <Button id={"leave-and-lock"}>{"Leave and lock"}</Button>
        </a>
      </ConditionalRender>
      <ConditionalRender isRendered={!hasCaseLock}>
        <a href={basePath}>
          <Button buttonColour={gdsLightGrey} buttonTextColour={textPrimary} id={"return-to-case-list"}>
            {"Return to case list"}
          </Button>
        </a>
      </ConditionalRender>
    </>
  )
}

export default Header
