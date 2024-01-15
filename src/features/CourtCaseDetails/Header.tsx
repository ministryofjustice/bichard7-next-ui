import Badge from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import HeaderContainer from "components/Header/HeaderContainer"
import HeaderRow from "components/Header/HeaderRow"
import LinkButton from "components/LinkButton"
import SecondaryButton from "components/SecondaryButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { Button, Heading } from "govuk-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import styled from "styled-components"
import Permission from "types/Permission"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { isLockedByCurrentUser } from "utils/caseLocks"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "utils/colours"
import Form from "../../components/Form"
import { ResolutionStatus } from "../../types/ResolutionStatus"
import ResolutionStatusBadge from "../CourtCaseList/tags/ResolutionStatusBadge"
import UrgentTag from "../CourtCaseList/tags/UrgentTag"
import LockStatusTag from "./LockStatusTag"

interface Props {
  canReallocate: boolean
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

const getResolutionStatus = (courtCase: DisplayFullCourtCase): ResolutionStatus | undefined => {
  if (courtCase.errorStatus === "Submitted") {
    return "Submitted"
  } else if (
    (courtCase.errorStatus === "Resolved" && courtCase.triggerStatus === "Resolved") ||
    (!courtCase.errorStatus && courtCase.triggerStatus === "Resolved") ||
    (!courtCase.triggerStatus && courtCase.errorStatus === "Resolved")
  ) {
    return "Resolved"
  }
}

const Header: React.FC<Props> = ({ canReallocate }: Props) => {
  const { basePath } = useRouter()
  const classes = useStyles()
  const csrfToken = useCsrfToken()
  const currentUser = useCurrentUser()
  const courtCase = useCourtCase()
  const previousPath = usePreviousPath()

  const leaveAndUnlockParams = getUnlockPath(courtCase)

  let reallocatePath = `${basePath}${usePathname()}/reallocate`
  let leaveAndUnlockUrl = `${basePath}?${leaveAndUnlockParams.toString()}`

  if (previousPath) {
    leaveAndUnlockUrl += `&${previousPath}`
    reallocatePath += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const caseIsViewOnly = !isLockedByCurrentUser(courtCase, currentUser.username)
  const hasCaseLock = isLockedByCurrentUser(courtCase, currentUser.username)

  return (
    <HeaderContainer id="header-container">
      <HeaderRow>
        <Heading as="h1" size="LARGE">
          {"Case details"}
        </Heading>
        <LockStatusTag
          isRendered={currentUser.hasAccessTo[Permission.Exceptions]}
          resolutionStatus={courtCase.errorStatus}
          lockName="Exceptions"
        />
      </HeaderRow>
      <HeaderRow>
        <Heading as="h2" size="MEDIUM">
          {courtCase.defendantName}
          {getResolutionStatus(courtCase) ? (
            <ResolutionStatusBadge resolutionStatus={getResolutionStatus(courtCase) || "Unresolved"} />
          ) : (
            <UrgentTag isUrgent={courtCase.isUrgent} />
          )}
          <Badge
            isRendered={caseIsViewOnly}
            label="View only"
            colour="blue"
            className="govuk-!-static-margin-left-5 view-only-badge"
          />
        </Heading>
        <LockStatusTag
          isRendered={currentUser.hasAccessTo[Permission.Triggers]}
          resolutionStatus={courtCase.triggerStatus}
          lockName="Triggers"
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
          <Form method="post" action={leaveAndUnlockUrl} csrfToken={csrfToken}>
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
