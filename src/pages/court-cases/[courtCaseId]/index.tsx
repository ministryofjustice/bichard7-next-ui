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

    const courtCase = await dataSource.transaction("SERIALIZABLE", async (transactionalEntityManager) => {
      const fetchedCourtCase = await getCourtCase(
        transactionalEntityManager,
        parseInt(courtCaseId, 10),
        currentUser.visibleForces
      )

      if (!fetchedCourtCase) {
        return new Error(NotFoundError)
      }

      if (isError(fetchedCourtCase)) {
        console.error(fetchedCourtCase)
        throw fetchedCourtCase
      }

      // If we fail to lock the record because someone else has already locked it since the original fetch,
      // fetch the newer data and return that
      return lockCourtCase(transactionalEntityManager, fetchedCourtCase, currentUser.username).then(
        (lockedCourtCase) => lockedCourtCase,
        (error) => {
          console.error(error)
          // TODO this doesn't really work, it just returns an error for courtCase instead of the updated court case
          return getCourtCase(transactionalEntityManager, parseInt(courtCaseId, 10), currentUser.visibleForces)
        }
      )
    })

    if ((isError(courtCase) && courtCase.message === NotFoundError) || courtCase === null) {
      return {
        notFound: true
      }
    } else if (isError(courtCase)) {
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
