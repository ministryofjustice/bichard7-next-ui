import Banner from "components/Banner"
import ButtonsGroup from "components/ButtonsGroup"
import ConditionalRender from "components/ConditionalRender"
import Form from "components/Form"
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
import resubmitCourtCase from "services/resubmitCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"
import Permission from "../../../types/Permission"
import forbidden from "../../../utils/forbidden"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext

    const { confirm } = query
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
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase),
      hasAmendments: false,
      amendments: "{}"
    }

    if (isPost(req)) {
      const { amendments } = formData as { amendments: string }

      const parsedAmendments = JSON.parse(amendments)

      const hasAmendments = Object.keys(parsedAmendments).length > 0
      props.hasAmendments = hasAmendments
      props.amendments = amendments

      return { props }
    } else {
      redirectTo(previousPath ?? `/court-cases/${courtCase.errorId}`)
    }

    if (isPost(req) && confirm) {
      const { amendments } = formData as { amendments: string }

      const parsedAmendments = JSON.parse(amendments)

      const updatedAmendments =
        Object.keys(parsedAmendments).length > 0 ? parsedAmendments : { noUpdatesResubmit: true }

      const amendedCase = await resubmitCourtCase(dataSource, updatedAmendments, +courtCaseId, currentUser)

      if (isError(amendedCase)) {
        throw amendedCase
      }

      let redirectUrl = `/court-cases/${courtCase.errorId}`

      if (previousPath) {
        redirectUrl += `?previousPath=${encodeURIComponent(previousPath)}`
      }

      if (!currentUser.hasAccessTo[Permission.Triggers] || courtCase.triggerStatus !== "Unresolved") {
        return redirectTo("/")
      }
      return redirectTo(redirectUrl)
    }
    return { props }
  }
)
interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  csrfToken: string
  previousPath: string | null
  hasAmendments?: boolean
  amendments?: string
}
const SubmitCourtCasePage: NextPage<Props> = ({
  courtCase,
  user,
  previousPath,
  hasAmendments = false,
  amendments = "{}",
  csrfToken
}: Props) => {
  const { basePath } = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  let backLink = `${basePath}/court-cases/${courtCase.errorId}`
  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }
  const resubmitCasePath = `${basePath}/court-cases/${courtCase.errorId}?resubmitCase=true`
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

          <ConditionalRender isRendered={hasAmendments}>
            <Paragraph>
              {"Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"}
            </Paragraph>
          </ConditionalRender>

          <ConditionalRender isRendered={!hasAmendments}>
            <Banner message="The case exception(s) have not been updated within Bichard." />
            <Paragraph data-testid="example-test-id">
              {"Do you want to submit case details to the PNC and mark the exception(s) as resolved?"}
            </Paragraph>
          </ConditionalRender>
          <Form action={resubmitCasePath} method="post" csrfToken={csrfToken}>
            <input type="hidden" name="amendments" value={amendments} />
            <ButtonsGroup>
              <Button id="Submit" type="submit">
                {"Submit exception(s)"}
              </Button>
              <Link href={backLink}>{"Cancel"}</Link>
            </ButtonsGroup>
          </Form>
        </Layout>
      </CurrentUserContext.Provider>
    </>
  )
}
export default SubmitCourtCasePage
