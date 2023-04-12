import Layout from "components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { BackLink, Heading } from "govuk-react"
import { useRouter } from "next/router"
import parseFormData from "utils/parseFormData"
import { isPost } from "utils/http"
import addNote from "services/addNote"
import redirectTo from "utils/redirectTo"
import AddNoteForm from "features/AddNoteForm/AddNoteForm"
import getCourtCaseByVisibleForce from "services/getCourtCaseByVisibleForce"
import { isError } from "types/Result"

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
      const { noteText } = (await parseFormData(req)) as { noteText: string }
      if (!noteText) {
        return {
          props: {
            ...props,
            noteTextError: "Required"
          }
        }
      }

      const addNoteResult = await addNote(dataSource, courtCase.errorId, currentUser.username, noteText)

      if (addNoteResult.isSuccessful) {
        return redirectTo(`/court-cases/${courtCaseId}`)
      } else {
        throw Error(addNoteResult.ValidationException ?? "Unexpected error")
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

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user, lockedByAnotherUser, noteTextError }: Props) => {
  const { basePath } = useRouter()

  return (
    <>
      <Layout user={user}>
        <Heading as="h1" size="LARGE" aria-label="Add Note">
          <title>{"Add Note | Bichard7"}</title>
          <meta name="description" content="Add Note | Bichard7" />
        </Heading>
        <BackLink href={`${basePath}/court-cases/${courtCase.errorId}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </BackLink>
        <AddNoteForm lockedByAnotherUser={lockedByAnotherUser} error={noteTextError} />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
