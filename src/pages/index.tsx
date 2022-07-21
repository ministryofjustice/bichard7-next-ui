import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import { queryParamToFilterState } from "components/CourtCaseFilters/ResultFilter"
import CourtCaseList from "components/CourtCaseList"
import CourtCaseFilter from "components/CourtCaseFilter"
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
  resultFilter?: Filter
  defendantNameFilter?: string
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const {
      orderBy,
      order,
      resultFilter: resultFilterParam,
      defendant
    } = query as {
      orderBy: string
      order: string
      resultFilter: string
      defendant: string
    }
    const resultFilter = queryParamToFilterState(resultFilterParam)

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      limit: 100,
      orderBy: orderBy,
      order: order as QueryOrder,
      defendantName: defendant,
      resultFilter: resultFilter
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

    if (resultFilter) {
      props.resultFilter = resultFilter
    }

    if (defendant) {
      props.defendantNameFilter = defendant
    }

    return { props }
  }
)

const Home: NextPage<Props> = ({ user, courtCases, order, resultFilter, defendantNameFilter }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <CourtCaseFilter resultFilter={resultFilter} defendantName={defendantNameFilter} />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
