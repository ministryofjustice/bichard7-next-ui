import CourtCaseList from "components/CourtCaseList"
import CourtCase from "entities/CourtCase"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import listCourtCases from "useCases/listCourtCases"

interface Props {
  username?: string
  courtCases?: CourtCase[]
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const visibleForces = currentUser?.visibleForces?.split(/[, ]/) || []
    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, visibleForces, 100)

    return {
      props: {
        username: currentUser?.username,
        courtCases: isError(courtCases) ? [] : JSON.parse(JSON.stringify(courtCases))
      }
    }
  }
)

const Home: NextPage = ({ username, courtCases }: Props) => {
  return (
    <div>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{`Cases for ${username}`}</h1>
        {courtCases && <CourtCaseList courtCases={courtCases}></CourtCaseList>}
      </main>
    </div>
  )
}

export default Home
