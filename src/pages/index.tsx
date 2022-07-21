import DefendantNameFilter from "components/DefendantNameFilter"
import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import User from "entities/User"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { QueryOrder } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import listCourtCases from "useCases/listCourtCases"
import CourtCaseList from "../components/CourtCaseList"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, defendant } = query as { orderBy: string; defendant: string }
    let { order } = query as { order: string }

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      limit: 100,
      orderBy: orderBy,
      order: order as QueryOrder,
      defendantName: defendant
    })

    if (isError(courtCases)) {
      throw courtCases
    }

    if (order === "ASC") {
      order = "DESC"
    } else {
      order = "ASC"
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCases: courtCases.map((courtCase) => courtCase.serialize()),
        order: order as QueryOrder
      }
    }
  }
)

const Home: NextPage<Props> = ({ user, courtCases, order }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <DefendantNameFilter />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
