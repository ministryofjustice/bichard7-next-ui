import { IncomingMessage } from "http"
import { isError, Result } from "types/Result"
import { parse } from "cookie"
import { unsign } from "cookie-signature"
import { CSRF } from "../../config"

export default (request: IncomingMessage, cookieName: string): Result<string> => {
  if (!request.headers.cookie) {
    return Error("Could not find CSRF cookie.")
  }

  const { cookieSecret } = CSRF
  const parsedCookie = parse(request.headers.cookie)
  const cookieToken = parsedCookie[cookieName]

  let unsignedCookieToken: string | false
  try {
    unsignedCookieToken = unsign(cookieToken, cookieSecret)
  } catch (error) {
    return isError(error) ? error : Error("Error parsing cookie token")
  }

  if (!unsignedCookieToken) {
    return Error("Invalid cookie token format.")
  }

  return unsignedCookieToken
}
