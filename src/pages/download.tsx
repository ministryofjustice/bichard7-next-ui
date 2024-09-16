import { getCookie } from "cookies-next"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { courtCaseToDisplayPartialCourtCaseDto } from "services/dto/courtCaseDto"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import getQueryStringCookieName from "utils/getQueryStringCookieName"
import redirectTo from "utils/redirectTo"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"
import { extractSearchParamsFromQuery } from "utils/extractSearchParamsFromQuery"
import { json2csv } from "json-2-csv"

type Props = {
  reportCsv: string
}

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

    const displayCases = courtCases.result.map((courtCase) =>
      courtCaseToDisplayPartialCourtCaseDto(courtCase, currentUser)
    )
    const csv = json2csv(displayCases)

    return {
      props: {
        reportCsv: csv
      }
    }
  }
)

const Home: NextPage<Props> = (props) => {
  const { reportCsv } = props

  const universalBom = "\uFEFF"
  const blobParts = [universalBom + reportCsv]
  const blobOptions: BlobPropertyBag = {
    type: "text/csv;charset=UTF-8"
  }

  const file = new Blob(blobParts, blobOptions)
  const downloadHref = window.URL.createObjectURL(file)

  return (
    <>
      <Head>
        <title>{"Bichard7 | Download Report"}</title>
        <meta name="description" content="Bichard7 | Download Report" />
      </Head>
      <a href={downloadHref}>{"download report"}</a>
    </>
  )
}

export default Home
