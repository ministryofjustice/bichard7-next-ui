import { getCookie } from "cookies-next"
import { IncomingMessage } from "http"
import { GetServerSidePropsResult } from "next"
import { ScriptProps } from "next/script"
import getQueryStringCookieName from "./getQueryStringCookieName"
import redirectTo from "./redirectTo"

const redirectToCaseIndex = (
  username: string,
  req: IncomingMessage
): GetServerSidePropsResult<ScriptProps> | undefined => {
  if (req.url) {
    const queryStringCookieValue = getCookie(getQueryStringCookieName(username), { req })
    const [urlPath, urlQueryString] = req.url.split("?")
    if (urlPath === "/" && queryStringCookieValue && !urlQueryString) {
      return redirectTo(`${urlPath}?${queryStringCookieValue}`)
    }
  }
}

export default redirectToCaseIndex
