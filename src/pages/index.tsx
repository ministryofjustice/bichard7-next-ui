import ConditionalDisplay from "components/ConditionalDisplay"
import Layout from "components/Layout"
import Pagination from "components/Pagination"
import AppliedFilters from "features/CourtCaseFilters/AppliedFilters"
import CourtCaseFilter from "features/CourtCaseFilters/CourtCaseFilter"
import CourtCaseWrapper from "features/CourtCaseFilters/CourtCaseFilterWrapper"
import CourtCaseList from "features/CourtCaseList/CourtCaseList"
import { Main } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import type CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getCountOfCasesByCaseAge from "services/getCountOfCasesByCaseAge"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import unlockCourtCase from "services/unlockCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { CaseState, NamedCourtDateRange, QueryOrder, Reason, Urgency } from "types/CaseListQueryParams"
import { CountOfCasesByCaseAgeResult } from "types/CountOfCasesByCaseAgeResult"
import { isError } from "types/Result"
import caseStateFilters from "utils/caseStateFilters"
import { isPost } from "utils/http"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import { reasonOptions } from "utils/reasonOptions"
import { validateCustomDateRange } from "utils/validators/validateCustomDateRange"
import { mapDateRanges } from "utils/validators/validateDateRanges"
import { mapLockFilter } from "utils/validators/validateLockFilter"
import { validateQueryParams } from "utils/validators/validateQueryParams"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  reasons: Reason[]
  keywords: string[]
  ptiurn: string | null
  courtName: string | null
  reasonCode: string | null
  urgent: string | null
  dateRange: NamedCourtDateRange[]
  courtCaseCounts: CountOfCasesByCaseAgeResult
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
      reasonCode,
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
    const reasons = [type].flat().filter((t) => reasonOptions.includes(String(t) as Reason)) as Reason[]
    const dateRanges = [dateRange]
      .flat()
      .filter((t) =>
        Object.keys(NamedDateRangeOptions).includes(String(t) as NamedCourtDateRange)
      ) as NamedCourtDateRange[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "25"
    const validatedPageNum = validateQueryParams(page) ? page : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "ptiurn"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "asc"
    const validatedDateRange = mapDateRanges(dateRange)
    const validatedCustomDateRange = validateCustomDateRange({
      from,
      to
    })
    const validatedDefendantName = validateQueryParams(keywords) ? keywords : undefined
    const validatedCourtName = validateQueryParams(courtName) ? courtName : undefined
    const validatedreasonCode = validateQueryParams(reasonCode) ? reasonCode : undefined
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

    const resolvedByUsername =
      validatedCaseState === "Resolved" && !currentUser.groups.includes("Supervisor") ? currentUser.username : undefined

    const courtCaseCounts = await getCountOfCasesByCaseAge(dataSource, currentUser.visibleForces)

    if (isError(courtCaseCounts)) {
      throw courtCaseCounts
    }

    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      ...(validatedDefendantName && { defendantName: validatedDefendantName }),
      ...(validatedCourtName && { courtName: validatedCourtName }),
      ...(validatedreasonCode && { reasonCode: validatedreasonCode }),
      ...(validatedPtiurn && { ptiurn: validatedPtiurn }),
      reasons: reasons,
      urgent: validatedUrgent,
      maxPageItems: validatedMaxPageItems,
      pageNum: validatedPageNum,
      orderBy: validatedOrderBy,
      order: validatedOrder,
      courtDateRange: validatedDateRange || validatedCustomDateRange,
      locked: lockedFilter,
      caseState: validatedCaseState,
      allocatedToUserName: validatedMyCases,
      resolvedByUsername
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
        reasons: reasons,
        keywords: validatedDefendantName ? [validatedDefendantName] : [],
        courtName: validatedCourtName ? validatedCourtName : null,
        reasonCode: validatedreasonCode ? validatedreasonCode : null,
        ptiurn: validatedPtiurn ? validatedPtiurn : null,
        dateRange: dateRanges,
        courtCaseCounts: courtCaseCounts,
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
  reasons,
  keywords,
  courtName,
  reasonCode,
  ptiurn,
  dateRange,
  courtCaseCounts,
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
      <Main />
      <CourtCaseWrapper
        filter={
          <CourtCaseFilter
            reasons={reasons}
            defendantName={keywords[0]}
            courtName={courtName}
            reasonCode={reasonCode}
            ptiurn={ptiurn}
            dateRange={dateRange}
            caseAgeCounts={courtCaseCounts}
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
              reasons,
              keywords,
              courtName,
              reasonCode,
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
          <ConditionalDisplay isDisplayed={courtCases.length > 0}>
            <Pagination pageNum={page} casesPerPage={casesPerPage} totalCases={totalCases} name="bottom" />
          </ConditionalDisplay>
        }
      />
    </Layout>
  </>
)

export default Home
