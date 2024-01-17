import ConditionalRender from "components/ConditionalRender"
import HeaderContainer from "components/Header/HeaderContainer"
import HeaderRow from "components/Header/HeaderRow"
import Layout from "components/Layout"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { BackLink, Heading } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useState } from "react"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import reallocateCourtCase from "services/reallocateCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import forbidden from "utils/forbidden"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"
import { CourtCaseContext, CourtCaseContextType } from "context/CourtCaseContext"
import { CsrfTokenContext, CsrfTokenContextType } from "context/CsrfTokenContext"
import { UserNotesTable } from "features/CourtCaseDetails/Tabs/Panels/Notes/UserNotesTable"
import ReallocationNotesForm from "components/ReallocationNotesForm"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { courtCaseId, previousPath } = query as {
      courtCaseId: string
      previousPath: string
    }

    const dataSource = await getDataSource()
    const courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    if (!courtCase.canReallocate(currentUser.username)) {
      return forbidden(res)
    }

    if (courtCase.phase !== 1) {
      return redirectTo(`/court-cases/${courtCase.errorId}`)
    }

    const props = {
      csrfToken,
      previousPath,
      user: userToDisplayFullUserDto(currentUser),
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase),
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
    }

    if (isPost(req)) {
      const { force, note } = formData as { force: string; note?: string }
      const reallocateResult = await reallocateCourtCase(dataSource, courtCase.errorId, currentUser, force, note)

      if (isError(reallocateResult)) {
        throw reallocateResult
      } else {
        return redirectTo("/")
      }
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  lockedByAnotherUser: boolean
  noteTextError?: string
  csrfToken: string
  previousPath: string
}

const ReallocateCasePage: NextPage<Props> = ({
  courtCase,
  user,
  lockedByAnotherUser,
  csrfToken,
  previousPath
}: Props) => {
  const { basePath } = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  const [courtCaseContext] = useState<CourtCaseContextType>({ courtCase: courtCase })
  const [csrfTokenContext] = useState<CsrfTokenContextType>({ csrfToken })

  let backLink = `${basePath}/court-cases/${courtCase.errorId}`

  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <Head>
        <title>{"Case Reallocation | Bichard7"}</title>
        <meta name="description" content="Case Reallocation | Bichard7" />
      </Head>
      <CurrentUserContext.Provider value={currentUserContext}>
        <CourtCaseContext.Provider value={courtCaseContext}>
          <CsrfTokenContext.Provider value={csrfTokenContext}>
            <Layout>
              <BackLink href={backLink} onClick={function noRefCheck() {}}>
                {"Case Details"}
              </BackLink>
              <HeaderContainer id="header-container">
                <HeaderRow>
                  <Heading as="h1" size="LARGE" aria-label="Reallocate Case">
                    {"Case reallocation"}
                  </Heading>
                </HeaderRow>
              </HeaderContainer>
              <ConditionalRender isRendered={lockedByAnotherUser}>
                {"Case is locked by another user."}
              </ConditionalRender>
              <ConditionalRender isRendered={!lockedByAnotherUser}>
                <div className="govuk-grid-row">
                  <ReallocationNotesForm csrfToken={csrfToken} courtCase={courtCase} backLink={backLink} />
                  <UserNotesTable className="govuk-grid-column-one-half" />
                </div>
              </ConditionalRender>
            </Layout>
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    </>
  )
}

export default ReallocateCasePage
