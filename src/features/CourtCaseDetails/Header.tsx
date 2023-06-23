import ConditionalRender from "components/ConditionalRender"
import UrgentBadge from "features/CourtCaseList/tags/UrgentBadge"
import { Button, Heading } from "govuk-react"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import styled from "styled-components"
import { isLockedByCurrentUser } from "utils/caseLocks"
import { gdsLightGrey, textPrimary } from "utils/colours"

interface Props {
  courtCase: CourtCase
  user: User
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  gap: 12px;
`

const useStyles = createUseStyles({
  button: {
    marginBottom: 0
  }
})

const Header: React.FC<Props> = ({ courtCase, user }: Props) => {
  const { basePath } = useRouter()
  const classes = useStyles()
  const leaveAndUnlockParams = new URLSearchParams({ unlockTrigger: courtCase.errorId?.toString() })
  const leaveAndUnlockUrl = `${basePath}?${leaveAndUnlockParams.toString()}`

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
      <ButtonContainer>
        <ConditionalRender isRendered={hasCaseLock}>
          <a href={basePath}>
            <Button id="leave-and-lock" className={classes.button}>
              {"Leave and lock"}
            </Button>
          </a>
          <form method="post" action={leaveAndUnlockUrl}>
            <Button id="leave-and-unlock" className={classes.button} type="submit">
              {"Leave and unlock"}
            </Button>
          </form>
        </ConditionalRender>
        <ConditionalRender isRendered={!hasCaseLock}>
          <a href={basePath}>
            <Button
              id="return-to-case-list"
              className={classes.button}
              buttonColour={gdsLightGrey}
              buttonTextColour={textPrimary}
            >
              {"Return to case list"}
            </Button>
          </a>
        </ConditionalRender>
      </ButtonContainer>
    </>
  )
}

export default Header
