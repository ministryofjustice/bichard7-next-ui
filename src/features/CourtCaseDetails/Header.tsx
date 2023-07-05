import Badge from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import LockedTag from "components/LockedTag"
import { Button, Heading } from "govuk-react"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import styled from "styled-components"
import {
  exceptionsAreLockedByAnotherUser,
  isLockedByCurrentUser,
  triggersAreLockedByAnotherUser
} from "utils/caseLocks"
import { gdsLightGrey, textPrimary } from "utils/colours"

interface Props {
  courtCase: CourtCase
  user: User
  canReallocate: boolean
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  gap: 12px;
`

const HeaderContainer = styled.div`
  margin-top: 30px;
`

const useStyles = createUseStyles({
  button: {
    marginBottom: 0
  }
})

const Header: React.FC<Props> = ({ courtCase, user, canReallocate }: Props) => {
  const { basePath } = useRouter()
  const classes = useStyles()

  const leaveAndUnlockParams = new URLSearchParams({ unlockTrigger: courtCase.errorId?.toString() })
  const leaveAndUnlockUrl = `${basePath}?${leaveAndUnlockParams.toString()}`

  const caseIsViewOnly = !isLockedByCurrentUser(courtCase, user.username)
  const hasCaseLock = isLockedByCurrentUser(courtCase, user.username)

  const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    & > #exceptions-locked-tag {
      padding-top: 10px;
    }
  `

  const CaseDetailsLockTag = ({
    isRendered,
    lockName,
    lockCheckFn,
    lockHolder
  }: {
    isRendered: boolean
    lockName: string
    lockCheckFn: (courtCase: CourtCase, user: string) => boolean
    lockHolder: string
  }) => (
    <ConditionalRender isRendered={isRendered}>
      <LockedTag lockName={lockName} lockedBy={lockCheckFn(courtCase, user.username) ? lockHolder : "Locked to you"} />
    </ConditionalRender>
  )

  return (
    <HeaderContainer>
      <HeaderRow>
        <Heading as="h1" size="LARGE" className="govuk-!-font-weight-regular">
          {"Case details"}
        </Heading>
        <CaseDetailsLockTag
          isRendered={user.hasAccessToExceptions}
          lockName="Exceptions"
          lockCheckFn={exceptionsAreLockedByAnotherUser}
          lockHolder={courtCase.errorLockedByUsername ?? "Another user"}
        />
      </HeaderRow>
      <HeaderRow>
        <Heading as="h2" size="MEDIUM" className="govuk-!-font-weight-regular">
          {courtCase.defendantName}
          <Badge
            isRendered={courtCase.isUrgent}
            label="Urgent"
            colour="red"
            className="govuk-!-static-margin-left-5 govuk-!-font-weight-regular urgent-badge"
          />
          <Badge
            isRendered={caseIsViewOnly}
            label="View only"
            colour="blue"
            className="govuk-!-static-margin-left-5 govuk-!-font-weight-regular view-only-badge"
          />
        </Heading>
        <CaseDetailsLockTag
          isRendered={user.hasAccessToTriggers}
          lockName="Triggers"
          lockCheckFn={triggersAreLockedByAnotherUser}
          lockHolder={courtCase.triggerLockedByUsername ?? "Another user"}
        />
      </HeaderRow>
      <ButtonContainer>
        <ConditionalRender isRendered={canReallocate}>
          <LinkButton
            href="reallocate"
            className="b7-reallocate-button"
            buttonColour={gdsLightGrey}
            buttonTextColour={textPrimary}
          >
            {"Reallocate Case"}
          </LinkButton>
        </ConditionalRender>
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
    </HeaderContainer>
  )
}

export default Header
