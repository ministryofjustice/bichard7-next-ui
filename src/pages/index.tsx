import DefendantNameFilter from "components/DefendantNameFilter"
import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import { CourtCaseFilter, queryParamToFilterState } from "components/CourtCaseFilter"
import CourtCaseList from "components/CourtCaseList"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { Filter, QueryOrder } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import User from "entities/User"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import listCourtCases from "useCases/listCourtCases"

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
    const { orderBy, order, filter, defendant } = query as {
      orderBy: string
      order: string
      filter: string
      defendant: string
    }
    const caseFilter = queryParamToFilterState(filter)

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      limit: 100,
      orderBy: orderBy,
      order: order as QueryOrder,
      defendantName: defendant,
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
        <DefendantNameFilter />
        <CourtCaseFilter initialSelection={filter} />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
