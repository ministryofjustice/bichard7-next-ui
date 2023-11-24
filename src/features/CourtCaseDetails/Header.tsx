import Badge from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import HeaderContainer from "components/Header/HeaderContainer"
import HeaderRow from "components/Header/HeaderRow"
import LinkButton from "components/LinkButton"
import LockedTag from "components/LockedTag"
import ResolvedTag from "components/ResolvedTag"
import SecondaryButton from "components/SecondaryButton"
import { useCsrfToken } from "context/CsrfTokenContext"
import { Button, Heading } from "govuk-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import styled from "styled-components"
import Permission from "types/Permission"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import {
  exceptionsAreLockedByCurrentUser,
  isLockedByCurrentUser,
  triggersAreLockedByCurrentUser
} from "utils/caseLocks"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "utils/colours"
import Form from "../../components/Form"

interface Props {
  courtCase: DisplayFullCourtCase
  user: DisplayFullUser
  canReallocate: boolean
  previousPath: string
}

type lockCheckFn = (courtCase: DisplayFullCourtCase, username: string) => boolean

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

const getUnlockPath = (courtCase: DisplayFullCourtCase): URLSearchParams => {
  const params = new URLSearchParams()
  if (courtCase.errorLockedByUsername) {
    params.set("unlockException", courtCase.errorId?.toString())
  }
  if (courtCase.triggerLockedByUsername) {
    params.set("unlockTrigger", courtCase.errorId?.toString())
  }
  return params
}

const Header: React.FC<Props> = ({ courtCase, user, canReallocate, previousPath }: Props) => {
  const { basePath } = useRouter()
  const classes = useStyles()
  const csrfTokenContext = useCsrfToken()

  const leaveAndUnlockParams = getUnlockPath(courtCase)

  let reallocatePath = `${basePath}${usePathname()}/reallocate`
  let leaveAndUnlockUrl = `${basePath}?${leaveAndUnlockParams.toString()}`

  if (previousPath) {
    leaveAndUnlockUrl += `&${previousPath}`
    reallocatePath += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const caseIsViewOnly = !isLockedByCurrentUser(courtCase, user.username)
  const hasCaseLock = isLockedByCurrentUser(courtCase, user.username)

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
    isResolved,
    lockName,
    getLockHolderFn
  }: {
    isRendered: boolean
    isResolved: boolean
    lockName: string
    getLockHolderFn: () => string
  }) => {
    if (!isRendered) {
      return
    }

    return isResolved ? (
      <ResolvedTag itemName={lockName} />
    ) : (
      <LockedTag lockName={lockName} lockedBy={getLockHolderFn()} />
    )
  }

  return (
    <HeaderContainer id="header-container">
      <HeaderRow>
        <Heading as="h1" size="LARGE">
          {"Case details"}
        </Heading>
        <CaseDetailsLockTag
          isRendered={user.hasAccessTo[Permission.Exceptions]}
          isResolved={courtCase.errorStatus === "Resolved"}
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
          isRendered={user.hasAccessTo[Permission.Triggers]}
          isResolved={courtCase.triggerStatus === "Resolved"}
          lockName="Triggers"
          getLockHolderFn={() =>
            getLockHolder(user.username, courtCase.triggerLockedByUserFullName, triggersAreLockedByCurrentUser)
          }
        />
      </HeaderRow>
      <ButtonContainer>
        <ConditionalRender isRendered={canReallocate && courtCase.phase === 1}>
          <LinkButton
            href={reallocatePath}
            className="b7-reallocate-button"
            buttonColour={gdsLightGrey}
            buttonTextColour={textPrimary}
            buttonShadowColour={gdsMidGrey}
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
          <Form method="post" action={leaveAndUnlockUrl} csrfToken={csrfTokenContext.csrfToken}>
            <Button id="leave-and-unlock" className={classes.button} type="submit">
              {"Leave and unlock"}
            </Button>
          </Form>
        </ConditionalRender>
        <ConditionalRender isRendered={!hasCaseLock}>
          <a href={basePath}>
            <SecondaryButton id="return-to-case-list" className={classes.button}>
              {"Return to case list"}
            </SecondaryButton>
          </a>
        </ConditionalRender>
      </ButtonContainer>
    </HeaderContainer>
  )
}

export default Header
