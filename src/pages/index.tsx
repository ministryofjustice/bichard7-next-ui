import Layout from "components/Layout"
import Pagination from "components/Pagination/Pagination"
import AppliedFilters from "features/CourtCaseFilters/AppliedFilters"
import CourtCaseFilter from "features/CourtCaseFilters/CourtCaseFilter"
import CourtCaseWrapper from "features/CourtCaseFilters/CourtCaseFilterWrapper"
import CourtCaseList from "features/CourtCaseList/CourtCaseList"
import { Heading } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import type CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { CaseState, QueryOrder, Reason, Urgency } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import caseStateFilters from "utils/caseStateFilters"
import { mapDateRange, validateNamedDateRange } from "utils/validators/validateDateRanges"
import { mapLockFilter } from "utils/validators/validateLockFilter"
import { validateQueryParams } from "utils/validators/validateQueryParams"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  courtCaseTypes: Reason[]
  keywords: string[]
  ptiurn: string | null
  courtName: string | null
  reasonSearch: string | null
  urgent: string | null
  totalPages: number
  dateRange: string | null
  pageNum: number
  locked: string | null
  caseState: CaseState | null
  myCases: boolean
}

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc" || param === undefined
const validCourtCaseTypes = ["Triggers", "Exceptions"]

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const {
      orderBy,
      pageNum,
      type,
      keywords,
      courtName,
      reasonSearch,
      ptiurn,
      maxPageItems,
      order,
      urgency,
      dateRange,
      locked,
      state,
      myCases
    } = query
    const courtCaseTypes = [type].flat().filter((t) => validCourtCaseTypes.includes(String(t))) as Reason[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "5"
    const validatedPageNum = validateQueryParams(pageNum) ? pageNum : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"
    const validatedDateRange = mapDateRange(dateRange)
    const validatedDefendantName = validateQueryParams(keywords) ? keywords : undefined
    const validatedCourtName = validateQueryParams(courtName) ? courtName : undefined
    const validatedReasonSearch = validateQueryParams(reasonSearch) ? reasonSearch : undefined
    const validatedPtiurn = validateQueryParams(ptiurn) ? ptiurn : undefined
    const validatedUrgent = validateQueryParams(urgency) ? (urgency as Urgency) : undefined
    const validatedLocked = validateQueryParams(locked) ? locked : undefined
    const validatedCaseState = caseStateFilters.includes(String(state)) ? (state as CaseState) : undefined
    const validatedMyCases = validateQueryParams(myCases) ? currentUser.username : undefined
    const lockedFilter = mapLockFilter(locked)
    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      ...(validatedDefendantName && { defendantName: validatedDefendantName }),
      ...(validatedCourtName && { courtName: validatedCourtName }),
      ...(validatedReasonSearch && { reasonsSearch: validatedReasonSearch }),
      ...(validatedPtiurn && { ptiurn: validatedPtiurn }),
      reasonsFilter: courtCaseTypes,
      urgent: validatedUrgent,
      maxPageItems: validatedMaxPageItems,
      pageNum: validatedPageNum,
      orderBy: validatedOrderBy,
      order: validatedOrder,
      courtDateRange: validatedDateRange,
      locked: lockedFilter,
      caseState: validatedCaseState,
      allocatedToUserName: validatedMyCases
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
        courtName: validatedCourtName ? validatedCourtName : null,
        reasonSearch: validatedReasonSearch ? validatedReasonSearch : null,
        ptiurn: validatedPtiurn ? validatedPtiurn : null,
        dateRange: validateQueryParams(dateRange) && validateNamedDateRange(dateRange) ? dateRange : null,
        urgent: validatedUrgent ? validatedUrgent : null,
        locked: validatedLocked ? validatedLocked : null,
        caseState: validatedCaseState ? validatedCaseState : null,
        myCases: !!validatedMyCases
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
  courtName,
  reasonSearch,
  ptiurn,
  dateRange,
  urgent,
  locked,
  caseState,
  myCases
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
        filter={
          <CourtCaseFilter
            courtCaseTypes={courtCaseTypes}
            defendantName={keywords[0]}
            courtName={courtName}
            reasonSearch={reasonSearch}
            ptiurn={ptiurn}
            dateRange={dateRange}
            urgency={urgent}
            locked={locked}
            caseState={caseState}
            myCases={myCases}
          />
        }
        appliedFilters={
          <AppliedFilters
            filters={{
              courtCaseTypes,
              keywords,
              courtName,
              reasonSearch,
              ptiurn,
              dateRange,
              urgency: urgent,
              locked: locked,
              caseState: caseState,
              myCases
            }}
          />
        }
        courtCaseList={<CourtCaseList courtCases={courtCases} order={order} />}
        pagination={<Pagination totalPages={totalPages} pageNum={pageNum} />}
      />
    </Layout>
  </>
)

export default Home
