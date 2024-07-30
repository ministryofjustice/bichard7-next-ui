import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import setCookie from "utils/setCookie"
import { CSRF } from "../../config"
import { generateCookieName, generateCsrfToken } from "./generateCsrfToken"
import verifyCsrfToken from "./verifyCsrfToken"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <Props extends { [key: string]: any }>(
  getServerSidePropsFunction: GetServerSideProps<Props>
): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const { isValid, formData } = await verifyCsrfToken(req)

    if (!isValid) {
      res.statusCode = 403
      res.statusMessage = "Invalid CSRF-token"
      res.setHeader("X-Status-Message", "Invalid CSRF-token")
      res.end()
      return { props: {} } as unknown as GetServerSidePropsResult<Props>
    }

    if (req.headers.referer) {
      const queryString = req.headers.referer.replace(/.*\/bichard/, "")

      let cookieName: string
      if (queryString.startsWith("/")) {
        cookieName = generateCookieName(queryString)
      } else {
        const queryParams = new URLSearchParams(queryString)
        cookieName = generateCookieName("/?" + queryParams.toString())
      }

      setCookie(res, cookieName, "", { expires: new Date(0), path: "/bichard", httpOnly: true })
    }

    const { maximumTokenAgeInSeconds } = CSRF
    const { formToken, cookieToken, cookieName } = generateCsrfToken(req)

    setCookie(res, cookieName, cookieToken, { maxAge: maximumTokenAgeInSeconds, path: "/bichard", httpOnly: true })

    return getServerSidePropsFunction({ ...context, formData, csrfToken: formToken } as CsrfServerSidePropsContext)
  }

  return result
}
