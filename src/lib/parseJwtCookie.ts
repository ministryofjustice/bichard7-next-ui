import { NextApiRequestCookies } from "next/dist/server/api-utils"
import type AuthJwt from "types/AuthJwt"

const parseJwt = (jwtPayload: string): AuthJwt => {
  const base64Decode = Buffer.from(jwtPayload, "base64")
  return JSON.parse(base64Decode.toString())
}

const parseJwtCookie = (request: { cookies: NextApiRequestCookies }): AuthJwt => {
  return parseJwt(request.cookies[".AUTH"].split(".")[1])
}

export default parseJwtCookie
