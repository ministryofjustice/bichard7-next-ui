import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import User from "entities/User"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import getCourtCase from "services/getCourtCase"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()
    const courtCase = await getCourtCase(dataSource, parseInt(courtCaseId, 10), currentUser.visibleForces)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCase.serialize()
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
