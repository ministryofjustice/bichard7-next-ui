import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import CourtCaseLock from "features/CourtCaseLock/CourtCaseLock"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import { fetchAndTryLockCourtCase } from "services/fetchAndTryLockCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()
    const courtCaseResult = await fetchAndTryLockCourtCase(currentUser, +courtCaseId, dataSource)

    if (courtCaseResult.notFound || !courtCaseResult.courtCase) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCaseResult.courtCase.serialize()
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user }: Props) => {
  const lockedByAnotherUser =
    (!!courtCase.errorLockedById && courtCase.errorLockedById !== user.username) ||
    (!!courtCase.triggerLockedById && courtCase.triggerLockedById !== user.username)

  return (
    <>
      <Head>
        <title>{"Case Details | Bichard7"}</title>
        <meta name="description" content="Case Details | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout user={user}>
        <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={lockedByAnotherUser} />
        <CourtCaseDetails courtCase={courtCase} />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
