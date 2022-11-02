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
import { Heading } from "govuk-react"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  courtCaseTypes: Filter[]
  keywords: string[]
  totalPages: number
  pageNum: number
}

const validateQueryParams = (param: string | string[] | undefined): param is string => typeof param === "string"
const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc" || param === undefined
const validCourtCaseTypes = ["triggers", "exceptions"]

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, pageNum, type, defendant, maxPageItems, order } = query
    const courtCaseTypes = [type].flat().filter((t) => validCourtCaseTypes.includes(String(t))) as Filter[]

    const validatedDefendantName = validateQueryParams(defendant) ? defendant : undefined
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"

    const validatedPageNum = validateQueryParams(pageNum) ? pageNum : "1"
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "5"

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      ...(validatedDefendantName && { defendantName: validatedDefendantName }),
      resultFilter: courtCaseTypes,
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
        courtCaseTypes: courtCaseTypes,
        keywords: validatedDefendantName ? [validatedDefendantName] : []
      }
    }
  }
)

const Home: NextPage<Props> = ({ user, courtCases, order, totalPages, pageNum, courtCaseTypes, keywords }: Props) => (
  <>
    <Head>
      <title>{"Case List | Bichard7"}</title>
      <meta name="description" content="Case List | Bichard7" />
    </Head>
    <Layout user={user}>
      <Heading as="h1" size="LARGE">
        {"Court cases"}
      </Heading>
      <CourtCaseFilter courtCaseTypes={courtCaseTypes} keywords={keywords} />
      <CourtCaseList courtCases={courtCases} order={order} />
      <Pagination totalPages={totalPages} pageNum={pageNum} />
    </Layout>
  </>
)

export default Home
