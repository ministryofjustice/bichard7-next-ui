import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getCourtCase from "services/getCourtCase"
import getDataSource from "services/getDataSource"
import lockCourtCase from "services/lockCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"

const NotFoundError = "Court case not found"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()

    const lockedCourtCase = await dataSource.transaction(async (transactionalEntityManager) => {
      const courtCase = await getCourtCase(
        transactionalEntityManager,
        parseInt(courtCaseId, 10),
        currentUser.visibleForces
      )

      if (!courtCase) {
        return new Error(NotFoundError)
      }

      if (isError(courtCase)) {
        console.error(courtCase)
        throw courtCase
      }

      return lockCourtCase(transactionalEntityManager, courtCase, currentUser.username)
    })

    if (isError(lockedCourtCase) && lockedCourtCase.message === NotFoundError) {
      return {
        notFound: true
      }
    } else if (isError(lockedCourtCase)) {
      console.error(lockedCourtCase)
      throw lockedCourtCase
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: lockedCourtCase.serialize()
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
