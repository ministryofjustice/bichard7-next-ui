import { getCookie } from "cookies-next"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
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
import { QueryType } from "../services/QueryColumns"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"

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

    const courtCases = await listCourtCases(dataSource, caseListQueryParams, currentUser, QueryType.ReportQuery)

    if (isError(courtCases)) {
      throw courtCases
    }

    const csv = json2csv(
      courtCases.result.map((courtCase) => {
        const caseDto = courtCaseToDisplayFullCourtCaseDto(courtCase, currentUser)
        return {
          hearingDate: caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing,
          courtName: caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation,
          hearingTime: caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.TimeOfHearing,
          defendantAddress: Object.values(
            caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address
          ).join(", "),
          dateOfBirth:
            caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate,
          PTIRUN: caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN,
          ASN: caseDto.asn,
          offenceTitles: caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
          nextCourtAppearance: caseDto.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing
        }
      })
    )

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
