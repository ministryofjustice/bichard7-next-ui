import { getCookie } from "cookies-next"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useEffect } from "react"
import { courtCaseToDisplayPartialCourtCaseDto } from "services/dto/courtCaseDto"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import getQueryStringCookieName from "utils/getQueryStringCookieName"
import redirectTo from "utils/redirectTo"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"
import { extractSearchParamsFromQuery } from "utils/extractSearchParamsFromQuery"
import { json2csv } from "json-2-csv"

type Props = {
  courtCases: DisplayPartialCourtCase[]
} & Omit<CaseListQueryParams, "allocatedToUserName" | "resolvedByUsername" | "courtDateRange" | "resolvedDateRange">

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
    const caseListQueryParams = extractSearchParamsFromQuery(query, currentUser)

    const dataSource = await getDataSource()

    // This needs to be here for the cookie to load/be sticky.
    // Do not remove!
    if (req.url) {
      const queryStringCookieValue = getCookie(getQueryStringCookieName(currentUser.username), { req })
      const [urlPath, urlQueryString] = req.url.split("?")
      if (urlPath === "/" && queryStringCookieValue && !urlQueryString) {
        return redirectTo(`${urlPath}?${queryStringCookieValue}`)
      }
    }

    const courtCases = await listCourtCases(dataSource, caseListQueryParams, currentUser)

    if (isError(courtCases)) {
      throw courtCases
    }

    return {
      props: {
        courtCases: courtCases.result.map((courtCase) => courtCaseToDisplayPartialCourtCaseDto(courtCase, currentUser))
      }
    }
  }
)

const Home: NextPage<Props> = (props) => {
  const { courtCases } = props

  useEffect(() => {
    const csv = json2csv(courtCases)

    const universalBom = "\uFEFF"
    const blobParts = [universalBom + csv]
    const blobOptions: BlobPropertyBag = {
      type: "text/csv;charset=UTF-8"
    }

    const file = new Blob(blobParts, blobOptions)
    const link = document.createElement("a")

    link.href = window.URL.createObjectURL(file)
    link.download = `report.csv`
    link.click()
  }, [courtCases])

  return (
    <>
      <Head>
        <title>{"Bichard7 | Download Report"}</title>
        <meta name="description" content="Bichard7 | Download Report" />
      </Head>
      <h1>{"Download"}</h1>
    </>
  )
}

export default Home
