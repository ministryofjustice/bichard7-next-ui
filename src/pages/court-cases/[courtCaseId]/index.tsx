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
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import { isError } from "types/Result"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()
    const { courtCase, error } = await fetchAndTryLockCourtCase(currentUser, +courtCaseId, dataSource)

    if (!courtCase || error) {
      return {
        notFound: true
      }
    }

    const aho = parseAhoXml(courtCase.hearingOutcome)
    if (isError(aho)) {
      console.error(`Failed to parse aho: ${aho}`)
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCase.serialize(),
        aho: JSON.parse(JSON.stringify(aho)),
        lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  lockedByAnotherUser: boolean
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, aho, user, lockedByAnotherUser }: Props) => (
  <>
    <Head>
      <title>{"Case Details | Bichard7"}</title>
      <meta name="description" content="Case Details | Bichard7" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout user={user}>
      <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={lockedByAnotherUser} />
      <CourtCaseDetails courtCase={courtCase} aho={aho} lockedByAnotherUser={lockedByAnotherUser} />
    </Layout>
  </>
)

export default CourtCaseDetailsPage
