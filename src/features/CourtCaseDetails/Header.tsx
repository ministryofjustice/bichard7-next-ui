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
import Feature from "types/Feature"
import {
  exceptionsAreLockedByCurrentUser,
  isLockedByCurrentUser,
  triggersAreLockedByCurrentUser
} from "utils/caseLocks"
import { gdsLightGrey, textPrimary } from "utils/colours"

interface Props {
  courtCase: CourtCase
  user: User
  canReallocate: boolean
}

type lockCheckFn = (courtCase: CourtCase, username: string) => boolean

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

const getUnlockPath = (courtCase: CourtCase): URLSearchParams => {
  const params = new URLSearchParams()
  if (courtCase.errorLockedByUsername) {
    params.set("unlockException", courtCase.errorId?.toString())
  }
  if (courtCase.triggerLockedByUsername) {
    params.set("unlockTrigger", courtCase.errorId?.toString())
  }
  return params
}

const Header: React.FC<Props> = ({ courtCase, user, canReallocate }: Props) => {
  const { basePath } = useRouter()
  const classes = useStyles()

  const leaveAndUnlockParams = getUnlockPath(courtCase)
  const leaveAndUnlockUrl = `${basePath}?${leaveAndUnlockParams.toString()}`
  const reallocatePath = `${basePath}/court-cases/${courtCase.errorId}/reallocate`

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

  const getLockHolder = (
    username: string,
    lockholder: string | null | undefined,
    lockedByCurrentUserFn: lockCheckFn
  ): string => {
    const lockedByCurrentUser = lockedByCurrentUserFn(courtCase, username)

    if (lockedByCurrentUser) {
      return "Locked to you"
    }

    return lockholder || ""
  }

  const CaseDetailsLockTag = ({
    isRendered,
    lockName,
    getLockHolderFn
  }: {
    isRendered: boolean
    lockName: string
    getLockHolderFn: () => string
  }) => (
    <ConditionalRender isRendered={isRendered}>
      <LockedTag lockName={lockName} lockedBy={getLockHolderFn()} />
    </ConditionalRender>
  )

  return (
    <HeaderContainer>
      <HeaderRow>
        <Heading as="h1" size="LARGE">
          {"Case details"}
        </Heading>
        <CaseDetailsLockTag
          isRendered={user.hasAccessTo[Feature.Exceptions]}
          lockName="Exceptions"
          getLockHolderFn={() =>
            getLockHolder(user.username, courtCase.errorLockedByUserFullName, exceptionsAreLockedByCurrentUser)
          }
        />
      </HeaderRow>
      <HeaderRow>
        <Heading as="h2" size="MEDIUM">
          {courtCase.defendantName}
          <Badge
            isRendered={courtCase.isUrgent}
            label="Urgent"
            colour="red"
            className="govuk-!-static-margin-left-5 urgent-badge"
          />
          <Badge
            isRendered={caseIsViewOnly}
            label="View only"
            colour="blue"
            className="govuk-!-static-margin-left-5 view-only-badge"
          />
        </Heading>
        <CaseDetailsLockTag
          isRendered={user.hasAccessTo[Feature.Triggers]}
          lockName="Triggers"
          getLockHolderFn={() =>
            getLockHolder(user.username, courtCase.triggerLockedByUserFullName, triggersAreLockedByCurrentUser)
          }
        />
      </HeaderRow>
      <ButtonContainer>
        <ConditionalRender isRendered={canReallocate}>
          <LinkButton
            href={reallocatePath}
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
