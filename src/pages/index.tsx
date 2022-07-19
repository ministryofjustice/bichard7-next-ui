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
import { Filter, QueryOrder } from "types/CaseListQueryParams"
import { CourtCaseFilter, queryParamToFilterState } from "components/CourtCaseFilter"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  filter?: Filter
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, order, filter } = query as { orderBy: string; order: string; filter: string }
    const caseFilter = queryParamToFilterState(filter)

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      limit: 100,
      orderBy: orderBy,
      order: order as QueryOrder,
      filter: caseFilter
    })

    if (isError(courtCases)) {
      throw courtCases
    }

    const oppositeOrder: QueryOrder = order === "asc" ? "desc" : "asc"

    const props: Props = {
      user: currentUser.serialize(),
      courtCases: courtCases.map((courtCase) => courtCase.serialize()),
      order: oppositeOrder
    }

    if (caseFilter) {
      props.filter = caseFilter
    }

    return { props }
  }
)

const Home: NextPage<Props> = ({ user, courtCases, order, filter }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <CourtCaseFilter initialSelection={filter} />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
