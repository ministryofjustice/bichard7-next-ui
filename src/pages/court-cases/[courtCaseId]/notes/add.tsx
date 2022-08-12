import Layout from "components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { BackLink } from "govuk-react"
import { useRouter } from "next/router"
import parseFormData from "utils/parseFormData"
import { isPost } from "utils/http"
import addNote from "services/addNote"
import redirectTo from "utils/redirectTo"
import AddNoteForm from "features/AddNoteForm/AddNoteForm"
import getCourtCase from "services/getCourtCase"
import { isError } from "types/Result"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }

    const dataSource = await getDataSource()
    const courtCase = await getCourtCase(dataSource, +courtCaseId, currentUser.visibleForces)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    if (isPost(req)) {
      const { noteText } = (await parseFormData(req)) as { noteText: string }
      const addNoteResult = await addNote(dataSource, courtCase.errorId, currentUser.username, noteText)

      if (addNoteResult.isSuccessful) {
        return redirectTo(`/court-cases/${courtCaseId}`)
      } else {
        throw Error(addNoteResult.ValidationException ?? "Unexpected error")
      }
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCase.serialize(),
        lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  lockedByAnotherUser: boolean
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user, lockedByAnotherUser }: Props) => {
  const { basePath } = useRouter()

  return (
    <>
      <Head>
        <title>{"Add Note | Bichard7"}</title>
        <meta name="description" content="Add Note | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout user={user}>
        <BackLink href={`${basePath}/court-cases/${courtCase.errorId}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </BackLink>
        <AddNoteForm lockedByAnotherUser={lockedByAnotherUser} />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
