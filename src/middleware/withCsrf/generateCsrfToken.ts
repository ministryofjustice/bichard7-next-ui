import { sign } from "cookie-signature"
import Tokens from "csrf"
import { IncomingMessage } from "http"
import { CSRF } from "../../config"

interface GenerateCsrfTokenResult {
  formToken: string
  cookieToken: string
  cookieName: string
}

const tokens = new Tokens()

const generateCookieName = (urlPath: string): string => {
  const { tokenName } = CSRF
  return encodeURIComponent(`${tokenName}${urlPath}`)
}

const generateCsrfToken = (request: IncomingMessage): GenerateCsrfTokenResult => {
  const { cookieSecret, formSecret, maximumTokenAgeInSeconds } = CSRF
  const tokenExpiryDate = new Date()
  tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + maximumTokenAgeInSeconds)
  const token = tokens.create(`${cookieSecret}${formSecret}`)
  const cookieToken = sign(token, cookieSecret)
  const cookieName = generateCookieName(request.url ?? "/")
  const formToken = sign(`${cookieName}=${tokenExpiryDate.getTime()}.${token}`, formSecret)

  return { formToken, cookieToken, cookieName }
}

export default generateCsrfToken
export { generateCookieName, generateCsrfToken }
