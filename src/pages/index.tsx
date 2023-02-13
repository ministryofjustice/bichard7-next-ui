import Layout from "components/Layout"
import Pagination from "components/Pagination"
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
import unlockCourtCase from "services/unlockCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { CaseState, QueryOrder, Reason, Urgency } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import caseStateFilters from "utils/caseStateFilters"
import { validateCustomDateRange } from "utils/validators/validateCustomDateRange"
import { isPost } from "utils/http"
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
  dateRange: string | null
  customDateFrom: string | null
  customDateTo: string | null
  page: number
  casesPerPage: number
  totalCases: number
  locked: string | null
  caseState: CaseState | null
  myCases: boolean
}

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc" || param === undefined
const validCourtCaseTypes = ["Triggers", "Exceptions"]

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as AuthenticationServerSidePropsContext
    const {
      orderBy,
      page,
      type,
      keywords,
      courtName,
      reasonSearch,
      ptiurn,
      maxPageItems,
      order,
      urgency,
      dateRange,
      from,
      to,
      locked,
      state,
      myCases,
      unlockException,
      unlockTrigger
    } = query
    const courtCaseTypes = [type].flat().filter((t) => validCourtCaseTypes.includes(String(t))) as Reason[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "25"
    const validatedPageNum = validateQueryParams(page) ? page : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"
    const validatedDateRange = mapDateRange(dateRange)
    const validatedCustomDateRange = validateCustomDateRange({
      from,
      to
    })
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

    if (isPost(req) && !!unlockException) {
      if (unlockException) {
        const lockResult = await unlockCourtCase(dataSource, +unlockException, currentUser, "Exception")
        if (isError(lockResult)) {
          throw lockResult
        }
      }
    } else if (isPost(req) && !!unlockTrigger) {
      if (unlockTrigger) {
        const lockResult = await unlockCourtCase(dataSource, +unlockTrigger, currentUser, "Trigger")
        if (isError(lockResult)) {
          throw lockResult
        }
      }
    }

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
      courtDateRange: validatedDateRange || validatedCustomDateRange,
      locked: lockedFilter,
      caseState: validatedCaseState,
      allocatedToUserName: validatedMyCases
    })

    const oppositeOrder: QueryOrder = validatedOrder === "asc" ? "desc" : "asc"

    if (isError(courtCases)) {
      throw courtCases
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCases: courtCases.result.map((courtCase: CourtCase) => courtCase.serialize()),
        order: oppositeOrder,
        totalCases: courtCases.totalCases,
        page: parseInt(validatedPageNum, 10) || 1,
        casesPerPage: parseInt(validatedMaxPageItems, 10) || 5,
        courtCaseTypes: courtCaseTypes,
        keywords: validatedDefendantName ? [validatedDefendantName] : [],
        courtName: validatedCourtName ? validatedCourtName : null,
        reasonSearch: validatedReasonSearch ? validatedReasonSearch : null,
        ptiurn: validatedPtiurn ? validatedPtiurn : null,
        dateRange: validateQueryParams(dateRange) && validateNamedDateRange(dateRange) ? dateRange : null,
        customDateFrom: validatedCustomDateRange?.from.toJSON() ?? null,
        customDateTo: validatedCustomDateRange?.to.toJSON() ?? null,
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
  page,
  casesPerPage,
  totalCases,
  courtCaseTypes,
  keywords,
  courtName,
  reasonSearch,
  ptiurn,
  dateRange,
  customDateFrom,
  customDateTo,
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
            customDateFrom={customDateFrom !== null ? new Date(customDateFrom) : null}
            customDateTo={customDateTo !== null ? new Date(customDateTo) : null}
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
              customDateFrom: customDateFrom !== null ? new Date(customDateFrom) : null,
              customDateTo: customDateTo !== null ? new Date(customDateTo) : null,
              urgency: urgent,
              locked: locked,
              caseState: caseState,
              myCases
            }}
          />
        }
        courtCaseList={<CourtCaseList courtCases={courtCases} order={order} currentUser={user} />}
        paginationTop={<Pagination pageNum={page} casesPerPage={casesPerPage} totalCases={totalCases} name="top" />}
        paginationBottom={
          <Pagination pageNum={page} casesPerPage={casesPerPage} totalCases={totalCases} name="bottom" />
        }
      />
    </Layout>
  </>
)

export default Home
