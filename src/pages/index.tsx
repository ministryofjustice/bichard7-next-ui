import CourtCaseFilter from "features/CourtCaseFilters/CourtCaseFilter"
import AppliedFilters from "features/CourtCaseFilters/AppliedFilters"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { Reason, QueryOrder, Urgency } from "types/CaseListQueryParams"
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
import CourtCaseWrapper from "features/CourtCaseFilters/CourtCaseFilterWrapper"
import { mapDateRange, validateNamedDateRange } from "utils/validators/validateDateRanges"
import { validateQueryParams } from "utils/validators/validateQueryParams"
import { mapLockFilter } from "utils/validators/validateLockFilter"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  courtCaseTypes: Reason[]
  keywords: string[]
  urgent: string | null
  totalPages: number
  dateRange: string | null
  pageNum: number
  locked: string | null
}

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc" || param === undefined
const validCourtCaseTypes = ["Triggers", "Exceptions"]

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, pageNum, type, keywords, maxPageItems, order, urgency, dateRange, locked } = query
    const courtCaseTypes = [type].flat().filter((t) => validCourtCaseTypes.includes(String(t))) as Reason[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "5"
    const validatedPageNum = validateQueryParams(pageNum) ? pageNum : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"
    const validatedDateRange = mapDateRange(dateRange)
    const validatedDefendantName = validateQueryParams(keywords) ? keywords : undefined
    const validatedUrgent = validateQueryParams(urgency) ? (urgency as Urgency) : undefined
    const validatedLocked = validateQueryParams(locked) ? locked : undefined

    const lockedFilter = mapLockFilter(locked)
    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      ...(validatedDefendantName && { defendantName: validatedDefendantName }),
      reasons: courtCaseTypes,
      urgent: validatedUrgent,
      maxPageItems: validatedMaxPageItems,
      pageNum: validatedPageNum,
      orderBy: validatedOrderBy,
      order: validatedOrder,
      courtDateRange: validatedDateRange,
      locked: lockedFilter
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
        dateRange: validateQueryParams(dateRange) && validateNamedDateRange(dateRange) ? dateRange : null,
        urgent: validatedUrgent ? validatedUrgent : null,
        locked: validatedLocked ? validatedLocked : null
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
  dateRange,
  urgent,
  locked
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
      <CourtCaseWrapper
        filter={<CourtCaseFilter />}
        appliedFilters={
          <AppliedFilters filters={{ courtCaseTypes, keywords, dateRange, urgency: urgent, locked: locked }} />
        }
        courtCaseList={<CourtCaseList courtCases={courtCases} order={order} />}
        pagination={<Pagination totalPages={totalPages} pageNum={pageNum} />}
      />
    </Layout>
  </>
)

export default Home
