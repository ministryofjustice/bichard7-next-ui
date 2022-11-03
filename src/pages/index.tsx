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
  urgentFilter: boolean
  totalPages: number
  pageNum: number
}

const validateQueryParams = (param: string | string[] | undefined): param is string => typeof param === "string"
const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc" || param === undefined
const validCourtCaseTypes = ["Triggers", "Exceptions"]

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, pageNum, type, keywords, maxPageItems, order, urgency } = query
    const courtCaseTypes = [type].flat().filter((t) => validCourtCaseTypes.includes(String(t))) as Filter[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "5"
    const validatedPageNum = validateQueryParams(pageNum) ? pageNum : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"

    const validatedDefendantName = validateQueryParams(keywords) ? keywords : undefined
    const validatedUrgentFilter = validateQueryParams(urgency) && urgency !== ""

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      ...(validatedDefendantName && { defendantName: validatedDefendantName }),
      resultFilter: courtCaseTypes,
      urgentFilter: validatedUrgentFilter,
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
        keywords: validatedDefendantName ? [validatedDefendantName] : [],
        urgentFilter: validatedUrgentFilter
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
  courtCaseTypes,
  keywords,
  urgentFilter
}: Props) => (
  <>
    <Head>
      <title>{"Case List | Bichard7"}</title>
      <meta name="description" content="Case List | Bichard7" />
    </Head>
    <Layout user={user}>
      <Heading as="h1" size="LARGE">
        {"Court cases"}
      </Heading>
      <div className="govuk-grid-row">
        <div className={"govuk-grid-column-one-third"}>
          <CourtCaseFilter courtCaseTypes={courtCaseTypes} keywords={keywords} urgency={urgentFilter} />
        </div>
        <div className={"govuk-grid-column-two-thirds"}>
          <CourtCaseList courtCases={courtCases} order={order} />
          <Pagination totalPages={totalPages} pageNum={pageNum} />
        </div>
      </div>
    </Layout>
  </>
)

export default Home
