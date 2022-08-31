import { queryParamToFilterState } from "features/CourtCaseFilters/ResultFilter"
import CourtCaseFilter from "features/CourtCaseFilters/CourtCaseFilter"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { Filter, QueryOrder } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import CourtCaseList from "features/CourtCaseList/CourtCaseList"
import Layout from "components/Layout"
import Pagination from "components/Pagination/Pagination"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import listCourtCases from "services/listCourtCases"

import type CourtCase from "services/entities/CourtCase"
import FeatureFlag from "components/FeatureFlag/FeatureFlag"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  resultFilter?: Filter
  defendantNameFilter?: string
  totalPages: number
  pageNum: number
}

const validateQueryParams = (param: string | string[] | undefined): param is string => typeof param === "string"
const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc" || param === undefined

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, pageNum, resultFilter: resultFilterParam, defendant, maxPageItems, order } = query
    const resultFilter = queryParamToFilterState(resultFilterParam as string)

    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "5"
    const validatedPageNum = validateQueryParams(pageNum) ? pageNum : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedDefendantName = validateQueryParams(defendant) ? defendant : undefined
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      ...(validatedDefendantName && { defendantName: validatedDefendantName }),
      resultFilter: resultFilter,
      maxPageItems: validatedMaxPageItems,
      pageNum: validatedPageNum,
      orderBy: validatedOrderBy,
      order: validatedOrder
    })

    const oppositeOrder: QueryOrder = validatedOrder === "asc" ? "desc" : "asc"

    if (isError(courtCases)) {
      throw courtCases
    }

    const totalPages = Math.ceil(courtCases.totalCases / parseInt(validatedMaxPageItems, 10)) ?? 1

    return {
      props: {
        user: currentUser.serialize(),
        courtCases: courtCases.result.map((courtCase: CourtCase) => courtCase.serialize()),
        order: oppositeOrder,
        totalPages: totalPages === 0 ? 1 : totalPages,
        pageNum: parseInt(validatedPageNum, 10) || 1,
        ...(resultFilter && { resultFilter }),
        ...(validatedDefendantName && { defendantNameFilter: validatedDefendantName })
      }
    }
  }
)

const Home: NextPage<Props> = ({
  user,
  courtCases,
  order,
  totalPages,
  pageNum,
  resultFilter,
  defendantNameFilter
}: Props) => (
  <>
    <Head>
      <title>{"Case List | Bichard7"}</title>
      <meta name="description" content="Case List | Bichard7" />
    </Head>

    <Layout user={user}>
      <CourtCaseFilter resultFilter={resultFilter} defendantName={defendantNameFilter} />
      <CourtCaseList courtCases={courtCases} order={order} />
      <Pagination totalPages={totalPages} pageNum={pageNum} />
    </Layout>
  </>
)

export default Home
