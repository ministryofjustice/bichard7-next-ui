import Banner from "components/Banner"
import ButtonsGroup from "components/ButtonsGroup"
import ConditionalRender from "components/ConditionalRender"
import HeaderContainer from "components/Header/HeaderContainer"
import HeaderRow from "components/Header/HeaderRow"
import Layout from "components/Layout"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { BackLink, Button, Heading, Link, Paragraph } from "govuk-react"
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
import resolveCourtCase from "services/resolveCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { ResolutionReasonKey } from "types/ManualResolution"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"
import Permission from "../../../types/Permission"
import forbidden from "../../../utils/forbidden"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken } = context as AuthenticationServerSidePropsContext &
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

    if (!courtCase.canResolveOrSubmit(currentUser)) {
      return forbidden(res)
    }

    const props: Props = {
      csrfToken,
      previousPath: previousPath ?? null,
      user: userToDisplayFullUserDto(currentUser),
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase)
    }

    if (isPost(req)) {
      const result = await resolveCourtCase(dataSource, courtCase, currentUser)

      if (isError(result)) {
        throw result
      }

      let redirectUrl = `/court-cases/${courtCase.errorId}`

      if (previousPath) {
        redirectUrl += `?previousPath=${encodeURIComponent(previousPath)}`
      }

      if (!currentUser.hasAccessTo[Permission.Triggers] || courtCase.triggerStatus !== "Unresolved") {
        return redirectTo("/")
      } else {
        return redirectTo(redirectUrl)
      }
    }

    return { props }
  }
)
interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  csrfToken: string
  previousPath: string | null
}
const SubmitCourtCasePage: NextPage<Props> = ({ courtCase, user, previousPath }: Props) => {
  const { basePath } = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  let backLink = `${basePath}/court-cases/${courtCase.errorId}`
  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }
  return (
    <>
      <CurrentUserContext.Provider value={currentUserContext}>
        <Layout>
          <Head>
            <title>{"Submit Case Exception(s) | Bichard7"}</title>
            <meta name="description" content="Submit Case Exception(s) | Bichard7" />
          </Head>
          <BackLink href={backLink} onClick={function noRefCheck() {}}>
            {"Case Details"}
          </BackLink>
          <HeaderContainer id="header-container">
            <HeaderRow>
              <Heading as="h1" size="LARGE" aria-label="Submit Exception(s)">
                {"Submit Exception(s)"}
              </Heading>
            </HeaderRow>
          </HeaderContainer>
          <ConditionalRender isRendered={true}>
            <Paragraph>
              {"Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"}
            </Paragraph>
          </ConditionalRender>
          <ConditionalRender isRendered={false}>
            <Banner message="The case exception(s) have not been updated within Bichard."></Banner>

            <Paragraph>
              {"Do you want to submit case details to the PNC and mark the exception(s) as resolved?"}
            </Paragraph>
          </ConditionalRender>

          <ButtonsGroup>
            <Button id="Submit" type="submit">
              {"Submit exception(s)"}
            </Button>
            <Link href={backLink}>{"Cancel"}</Link>
          </ButtonsGroup>
        </Layout>
      </CurrentUserContext.Provider>
    </>
  )
}
export default SubmitCourtCasePage
