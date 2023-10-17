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

export default (request: IncomingMessage): GenerateCsrfTokenResult => {
  const { tokenName, cookieSecret, formSecret, maximumTokenAgeInSeconds } = CSRF
  const tokenExpiryDate = new Date()
  tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + maximumTokenAgeInSeconds)
  const token = tokens.create(`${cookieSecret}${formSecret}`)
  const cookieToken = sign(token, cookieSecret)
  const cookieName = encodeURIComponent(`${tokenName}${request.url}`)
  const formToken = sign(`${cookieName}=${tokenExpiryDate.getTime()}.${token}`, formSecret)

  return { formToken, cookieToken, cookieName }
}
