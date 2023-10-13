import ConditionalRender from "components/ConditionalRender"
import Layout from "components/Layout"
import { BackLink, Button, FormGroup, Heading, Select, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import resolveCourtCase from "services/resolveCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { ResolutionReasonKey, ResolutionReasons } from "types/ManualResolution"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import forbidden from "../../../utils/forbidden"
import Form from "../../../components/Form"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }

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
      user: userToDisplayFullUserDto(currentUser),
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase),
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
    }

    if (isPost(req)) {
      const { reason, reasonText } = formData as { reason: string; reasonText: string }
      const validation = validateManualResolution({ reason: reason as ResolutionReasonKey, reasonText })

      if (validation.error) {
        return {
          props: {
            ...props,
            reasonTextError: validation.error,
            selectedReason: reason as ResolutionReasonKey
          }
        }
      }

      await resolveCourtCase(
        dataSource,
        courtCase,
        { reason: reason as ResolutionReasonKey, reasonText: reasonText ?? "" },
        currentUser
      )

      return redirectTo(`/court-cases/${courtCase.errorId}`)
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  lockedByAnotherUser: boolean
  reasonTextError?: string
  selectedReason?: ResolutionReasonKey
  csrfToken: string
}

const ResolveCourtCasePage: NextPage<Props> = ({
  courtCase,
  user,
  lockedByAnotherUser,
  selectedReason,
  reasonTextError,
  csrfToken
}: Props) => {
  const { basePath } = useRouter()

  return (
    <>
      <Layout user={user}>
        <Heading as="h1" size="LARGE" aria-label="Resolve Case">
          <title>{"Resolve Case | Bichard7"}</title>
          <meta name="description" content="Resolve Case| Bichard7" />
        </Heading>
        <BackLink href={`${basePath}/court-cases/${courtCase.errorId}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </BackLink>
        <Heading as="h2" size="MEDIUM">
          {"Resolve Case"}
        </Heading>
        <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
        <ConditionalRender isRendered={!lockedByAnotherUser}>
          <Form method="POST" action="#" csrfToken={csrfToken}>
            <FormGroup>
              <Select
                input={{
                  name: "reason"
                }}
                label="Select a reason"
              >
                {Object.keys(ResolutionReasons).map((reason) => {
                  return (
                    <option selected={selectedReason === reason} key={reason} value={reason}>
                      {ResolutionReasons[reason as ResolutionReasonKey]}
                    </option>
                  )
                })}
              </Select>
              <TextArea
                input={{
                  name: "reasonText"
                }}
                meta={{
                  error: reasonTextError,
                  touched: !!reasonTextError
                }}
              >
                {"Resolution details"}
              </TextArea>
            </FormGroup>

            <Button id="Resolve" type="submit">
              {"Resolve"}
            </Button>
          </Form>
        </ConditionalRender>
      </Layout>
    </>
  )
}

export default ResolveCourtCasePage
