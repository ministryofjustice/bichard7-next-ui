import CourtCaseList from "../components/CourtCaseList"
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
import listCourtCases from "useCases/listCourtCases"

interface Props {
  user: User
  courtCases: CourtCase[]
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, { forces: currentUser.visibleForces, limit: 100 })

    if (isError(courtCases)) {
      throw courtCases
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCases: courtCases.map((courtCase) => courtCase.serialize())
      }
    }
  }
)

const Home: NextPage<Props> = ({ user, courtCases }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <CourtCaseList courtCases={courtCases} />
      </Layout>
    </>
  )
}

export default Home
