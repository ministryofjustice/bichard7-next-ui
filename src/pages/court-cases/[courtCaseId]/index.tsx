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
import { Paragraph } from "govuk-react"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()
    const { courtCase, notFound, error } = await fetchAndTryLockCourtCase(currentUser, +courtCaseId, dataSource)

    if (notFound || !courtCase) {
      return {
        notFound: true
      }
    }

    if (error) {
      props: {
        lockingError: ""
      }
    }

    return {
      props: {
        lockingError: "",
        user: currentUser.serialize(),
        courtCase: courtCase.serialize()
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  errorMessage: string
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user, lockingError }: Props) => {
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
        <Paragraph>{lockingError}</Paragraph>
        <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={lockedByAnotherUser} />
        <CourtCaseDetails courtCase={courtCase} />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
