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
import { CaseState, QueryOrder, Reason, Urgency, SerializedCourtDateRange } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import caseStateFilters from "utils/caseStateFilters"
import { isPost } from "utils/http"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { reasonOptions } from "utils/reasonOptions"
import { validateDateRange } from "utils/validators/validateDateRange"
import { mapCaseAges } from "utils/validators/validateCaseAges"
import { mapLockFilter } from "utils/validators/validateLockFilter"
import { validateQueryParams } from "utils/validators/validateQueryParams"
import type { KeyValuePair } from "types/KeyValuePair"
import { formatFormInputDateString } from "utils/formattedDate"
import redirectTo from "utils/redirectTo"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { setCookie, getCookie } from "cookies-next"
import hashString from "utils/hashString"
import { Groups } from "types/GroupName"

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
  caseAge: string[]
  caseAgeCounts: KeyValuePair<string, number>
  dateRange: SerializedCourtDateRange | null
  page: number
  casesPerPage: number
  totalCases: number
  locked: string | null
  caseState: CaseState | null
  myCases: boolean
  queryStringCookieName: string
}

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as AuthenticationServerSidePropsContext
    const queryStringCookieName = `qs_case_list_${hashString(currentUser.username)}`
    // prettier-ignore
    const {
      orderBy, page, type, keywords, courtName, reasonCode, ptiurn, maxPageItems, order,
      urgency, caseAge, from, to, locked, state, myCases, unlockException, unlockTrigger
    } = query
    const reasons = [type].flat().filter((t) => reasonOptions.includes(String(t) as Reason)) as Reason[]
    const caseAges = [caseAge]
      .flat()
      .filter((t) => Object.keys(CaseAgeOptions).includes(String(t) as string)) as string[]
    const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "25"
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

    if (req.url) {
      const queryStringCookieValue = getCookie(queryStringCookieName, { req })
      const [urlPath, urlQueryString] = req.url.split("?")
      if (urlPath === "/" && queryStringCookieValue && !urlQueryString) {
        return redirectTo(`${urlPath}?${queryStringCookieValue}`)
      }
    }

    const resolvedByUsername =
      validatedCaseState === "Resolved" && !currentUser.groups.includes("Supervisor") ? currentUser.username : undefined

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
        queryStringCookieName
      }
    }
  }
)

const Home: NextPage<Props> = (query) => {
  const router = useRouter()
  // prettier-ignore
  const {
    user, courtCases, order, page, casesPerPage, totalCases, reasons, keywords, courtName, reasonCode,
    ptiurn, caseAge, caseAgeCounts, dateRange, urgent, locked, caseState, myCases, queryStringCookieName
  } = query

  useEffect(() => {
    const [, queryString] = router.asPath.split("?")
    setCookie(queryStringCookieName, queryString, { path: "/" })
  }, [router, queryStringCookieName])

  return (
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
              caseAge={caseAge}
              caseAgeCounts={caseAgeCounts}
              dateRange={dateRange}
              urgency={urgent}
              locked={locked}
              caseState={caseState}
              myCases={myCases}
              userGroups={user.groups.filter((g) => g !== Groups.NewUI)}
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
}

export default Home
