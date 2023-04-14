import Layout from "components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { BackLink, Button, FormGroup, Heading, Select } from "govuk-react"
import { useRouter } from "next/router"
import parseFormData from "utils/parseFormData"
import { isPost } from "utils/http"
import getCourtCaseByVisibleForce from "services/getCourtCaseByVisibleForce"
import { isError } from "types/Result"
import ConditionalRender from "components/ConditionalRender"
import reallocateCourtCaseToForce from "services/reallocateCourtCaseToForce"
import redirectTo from "utils/redirectTo"
import forces from "@moj-bichard7-developers/bichard7-next-data/dist/data/forces.json"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }

    const dataSource = await getDataSource()
    const courtCase = await getCourtCaseByVisibleForce(dataSource, +courtCaseId, currentUser.visibleCases)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    const props = {
      user: currentUser.serialize(),
      courtCase: courtCase.serialize(),
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
    }

    if (isPost(req)) {
      const { force } = (await parseFormData(req)) as { force: string }
      const reallocateResult = await reallocateCourtCaseToForce(dataSource, courtCase.errorId, currentUser, force)

      if (isError(reallocateResult)) {
        throw reallocateResult
      } else {
        return redirectTo(`/`)
      }
    }

    return { props }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  lockedByAnotherUser: boolean
  noteTextError?: string
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user, lockedByAnotherUser }: Props) => {
  const { basePath } = useRouter()

  return (
    <>
      <Layout user={user}>
        <Heading as="h1" size="LARGE" aria-label="Reallocate Case">
          <title>{"Reallocate Case | Bichard7"}</title>
          <meta name="description" content="Reallocate Case| Bichard7" />
        </Heading>
        <BackLink href={`${basePath}/court-cases/${courtCase.errorId}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </BackLink>
        <Heading as="h2" size="MEDIUM">
          {"Reallocate Case"}
        </Heading>
        <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
        <ConditionalRender isRendered={!lockedByAnotherUser}>
          <form method="POST" action="#">
            <FormGroup>
              <Select
                input={{
                  name: "force"
                }}
                label="Select force"
              >
                {forces.map((force) => {
                  return <option key={force.code} value={force.code}>{`${force.name}`}</option>
                })}
              </Select>
            </FormGroup>

            <Button id="Reallocate" type="submit">
              {"Reallocate"}
            </Button>
          </form>
        </ConditionalRender>
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
