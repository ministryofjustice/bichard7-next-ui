import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import { lockWhileFetchingCourtCase } from "services/lockWhileFetchingCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()

    // TODO this function may not actually acquire the lock, rename me
    let courtCaseResult = await lockWhileFetchingCourtCase(currentUser, courtCaseId, dataSource)

    if (isError(courtCaseResult)) {
      throw courtCaseResult
    }

    if (courtCaseResult.notFound) {
      return {
        notFound: true
      }
    }

    if (courtCaseResult.lockAcquireFailed) {
      courtCaseResult = await lockWhileFetchingCourtCase(currentUser, courtCaseId, dataSource)

      if (isError(courtCaseResult)) {
        throw courtCaseResult
      }

      if (courtCaseResult.notFound || !courtCaseResult.courtCase) {
        return {
          notFound: true
        }
      }
    }

    return {
      props: {
        user: currentUser.serialize(),
        // TODO add handling for courtCase being undefined
        courtCase: courtCaseResult.courtCase!.serialize()
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case Details | Bichard7"}</title>
        <meta name="description" content="Case Details | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout user={user}>
        <CourtCaseDetails courtCase={courtCase} />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
