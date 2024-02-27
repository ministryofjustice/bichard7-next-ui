import Layout from "components/Layout"
import Pagination from "components/Pagination"
import { CsrfTokenContext, CsrfTokenContextType } from "context/CsrfTokenContext"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { getCookie, setCookie } from "cookies-next"
import AppliedFilters from "features/CourtCaseFilters/AppliedFilters"
import CourtCaseFilter from "features/CourtCaseFilters/CourtCaseFilter"
import CourtCaseWrapper from "features/CourtCaseFilters/CourtCaseFilterWrapper"
import CourtCaseList from "features/CourtCaseList/CourtCaseList"
import { Main } from "govuk-react"
import { isEqual } from "lodash"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import { courtCaseToDisplayPartialCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCountOfCasesByCaseAge from "services/getCountOfCasesByCaseAge"
import getDataSource from "services/getDataSource"
import getLastSwitchingFormSubmission from "services/getLastSwitchingFormSubmission"
import listCourtCases from "services/listCourtCases"
import unlockCourtCase from "services/unlockCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { CaseState, QueryOrder, Reason, SerializedCourtDateRange, Urgency } from "types/CaseListQueryParams"
import Permission from "types/Permission"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import caseStateFilters from "utils/caseStateFilters"
import { formatFormInputDateString } from "utils/formattedDate"
import getQueryStringCookieName from "utils/getQueryStringCookieName"
import { isPost } from "utils/http"
import { logUiDetails } from "utils/logUiDetails"
import { calculateLastPossiblePageNumber } from "utils/pagination/calculateLastPossiblePageNumber"
import { reasonOptions } from "utils/reasonOptions"
import redirectTo from "utils/redirectTo"
import removeBlankQueryParams from "utils/deleteQueryParam/removeBlankQueryParams"
import { mapCaseAges } from "utils/validators/validateCaseAges"
import { validateDateRange } from "utils/validators/validateDateRange"
import { mapLockFilter } from "utils/validators/validateLockFilter"
import { validateQueryParams } from "utils/validators/validateQueryParams"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"
import shouldShowSwitchingFeedbackForm from "../utils/shouldShowSwitchingFeedbackForm"

interface Props {
  csrfToken: string
  user: DisplayFullUser
  courtCases: DisplayPartialCourtCase[]
  order: QueryOrder
  reasons: Reason[]
  keywords: string[]
  ptiurn: string | null
  courtName: string | null
  reasonCode: string | null
  urgent: string | null
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  dateRange: SerializedCourtDateRange | null
  page: number
  casesPerPage: number
  totalCases: number
  locked: string | null
  caseState: CaseState | null
  myCases: boolean
  queryStringCookieName: string
  displaySwitchingSurveyFeedback: boolean
  searchOrder: string | null
  orderBy: string | null
  environment: string | null
  build: string | null
}

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param === "desc"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query, csrfToken } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const queryStringCookieName = getQueryStringCookieName(currentUser.username)
    // prettier-ignore
    const {
      orderBy, page, type, keywords, courtName, reasonCode, ptiurn, maxPageItems, order,
      urgency, caseAge, from, to, locked, state, myCases, unlockException, unlockTrigger
    } = query
    const reasons = [type].flat().filter((t) => reasonOptions.includes(String(t) as Reason)) as Reason[]
    const caseAges = [caseAge]
      .flat()
      .filter((t) => Object.keys(CaseAgeOptions).includes(String(t) as string)) as string[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "50"
    const validatedPageNum = validateQueryParams(page) ? page : "1"
    const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "courtDate"
    const validatedOrder: QueryOrder = validateOrder(order) ? order : "desc"
    const validatedCaseAges = mapCaseAges(caseAge)
    const validatedDateRange = validateDateRange({
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

    if (isPost(req) && typeof unlockException === "string") {
      const lockResult = await unlockCourtCase(dataSource, +unlockException, currentUser, UnlockReason.Exception)
      if (isError(lockResult)) {
        throw lockResult
      }
    }

    if (isPost(req) && typeof unlockTrigger === "string") {
      const lockResult = await unlockCourtCase(dataSource, +unlockTrigger, currentUser, UnlockReason.Trigger)
      if (isError(lockResult)) {
        throw lockResult
      }
    }

    // This needs to be here for the cookie to load/be sticky.
    // Do not remove!
    if (req.url) {
      const queryStringCookieValue = getCookie(getQueryStringCookieName(currentUser.username), { req })
      const [urlPath, urlQueryString] = req.url.split("?")
      if (urlPath === "/" && queryStringCookieValue && !urlQueryString) {
        return redirectTo(`${urlPath}?${queryStringCookieValue}`)
      }
    }

    const resolvedByUsername =
      validatedCaseState === "Resolved" && !currentUser.hasAccessTo[Permission.ListAllCases]
        ? currentUser.username
        : undefined

    const caseAgeCounts = await getCountOfCasesByCaseAge(dataSource, currentUser)

    if (isError(caseAgeCounts)) {
      throw caseAgeCounts
    }

    const courtCases = await listCourtCases(
      dataSource,
      {
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
        courtDateRange: validatedCaseAges || validatedDateRange,
        locked: lockedFilter,
        caseState: validatedCaseState,
        allocatedToUserName: validatedMyCases,
        resolvedByUsername
      },
      currentUser
    )

    const oppositeOrder: QueryOrder = validatedOrder === "asc" ? "desc" : "asc"

    if (isError(courtCases)) {
      throw courtCases
    }

    const lastPossiblePageNumber = calculateLastPossiblePageNumber(courtCases.totalCases, +validatedMaxPageItems)
    if (+validatedPageNum > lastPossiblePageNumber) {
      if (req.url) {
        const [urlPath, urlQuery] = req.url.split("?")
        const parsedUrlQuery = new URLSearchParams(urlQuery)
        parsedUrlQuery.set("page", lastPossiblePageNumber.toString())
        return redirectTo(`${urlPath}?${parsedUrlQuery.toString()}`)
      }
    }

    const lastSwitchingFormSubmission = await getLastSwitchingFormSubmission(dataSource, currentUser.id)

    if (isError(lastSwitchingFormSubmission)) {
      throw lastSwitchingFormSubmission
    }

    return {
      props: {
        csrfToken: csrfToken,
        user: userToDisplayFullUserDto(currentUser),
        courtCases: courtCases.result.map((courtCase) => courtCaseToDisplayPartialCourtCaseDto(courtCase, currentUser)),
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        order: oppositeOrder,
        searchOrder: validatedOrder === "asc" ? "asc" : "desc",
        orderBy: validatedOrderBy,
        totalCases: courtCases.totalCases,
        page: parseInt(validatedPageNum, 10) || 1,
        casesPerPage: parseInt(validatedMaxPageItems, 10) || 5,
        reasons: reasons,
        keywords: validatedDefendantName ? [validatedDefendantName] : [],
        courtName: validatedCourtName ? validatedCourtName : null,
        reasonCode: validatedreasonCode ? validatedreasonCode : null,
        ptiurn: validatedPtiurn ? validatedPtiurn : null,
        caseAge: caseAges,
        dateRange: validatedDateRange
          ? {
              from: formatFormInputDateString(validatedDateRange.from),
              to: formatFormInputDateString(validatedDateRange.to)
            }
          : null,
        caseAgeCounts: caseAgeCounts,
        urgent: validatedUrgent ? validatedUrgent : null,
        locked: validatedLocked ? validatedLocked : null,
        caseState: validatedCaseState ? validatedCaseState : null,
        myCases: !!validatedMyCases,
        queryStringCookieName,
        environment: process.env.NEXT_PUBLIC_WORKSPACE || null,
        build: process.env.NEXT_PUBLIC_BUILD || null
      }
    }
  }
)

const Home: NextPage<Props> = (props) => {
  const router = useRouter()
  const {
    csrfToken,
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
    caseAge,
    caseAgeCounts,
    dateRange,
    urgent,
    locked,
    caseState,
    myCases,
    queryStringCookieName,
    displaySwitchingSurveyFeedback,
    searchOrder,
    orderBy,
    environment,
    build
  } = props

  useEffect(() => {
    logUiDetails(environment, build)
    const nonSavedParams = ["unlockTrigger", "unlockException"]
    const [, queryString] = router.asPath.split("?")

    const queryParams = new URLSearchParams(queryString)
    nonSavedParams.map((param) => queryParams.delete(param))

    setCookie(queryStringCookieName, queryParams.toString(), { path: "/" })

    const { pathname } = router
    const newQueryParams = removeBlankQueryParams(queryParams)
    nonSavedParams.map((param) => newQueryParams.delete(param))

    if (!isEqual(newQueryParams.toString(), queryParams.toString())) {
      router.push({ pathname, query: newQueryParams.toString() }, undefined, { shallow: true })
    }
  }, [router, queryStringCookieName, environment, build])

  const [csrfTokenContext] = useState<CsrfTokenContextType>({ csrfToken })
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <>
      <Head>
        <title>{"Bichard7 | Case List"}</title>
        <meta name="description" content="Bichard7 | Case List" />
      </Head>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          <Layout bichardSwitch={{ display: true, displaySwitchingSurveyFeedback }}>
            <Main />
            <CourtCaseWrapper
              filter={
                <CourtCaseFilter
                  reasons={reasons}
                  defendantName={keywords[0]}
                  courtName={courtName}
                  reasonCode={reasonCode}
                  ptiurn={ptiurn}
                  caseAge={caseAge}
                  caseAgeCounts={caseAgeCounts}
                  dateRange={dateRange}
                  urgency={urgent}
                  locked={locked}
                  caseState={caseState}
                  myCases={myCases}
                  order={searchOrder}
                  orderBy={orderBy}
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
                    caseAge,
                    dateRange: dateRange,
                    urgency: urgent,
                    locked: locked,
                    caseState: caseState,
                    myCases
                  }}
                />
              }
              courtCaseList={<CourtCaseList courtCases={courtCases} order={order} />}
              paginationTop={
                <Pagination pageNum={page} casesPerPage={casesPerPage} totalCases={totalCases} name="top" />
              }
              paginationBottom={
                <Pagination pageNum={page} casesPerPage={casesPerPage} totalCases={totalCases} name="bottom" />
              }
            />
          </Layout>
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default Home
