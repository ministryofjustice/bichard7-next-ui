import { CONDUCTOR_API_PASSWORD, CONDUCTOR_API_USER } from "../../config"

const base64 = (input: string): string => Buffer.from(input).toString("base64")

export const basicAuthenticationHeaders = (): { Authorization: string } => {
  return { Authorization: `Basic ${base64(`${CONDUCTOR_API_USER}:${CONDUCTOR_API_PASSWORD}`)}` }
}
