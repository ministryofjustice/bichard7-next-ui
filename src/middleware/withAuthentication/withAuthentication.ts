import getConnection from "lib/getConnection"
import { isTokenIdValid } from "lib/token/authenticationToken"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isSuccess } from "types/Result"
import User from "types/User"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import logger from "utils/logger"
import getAuthenticationPayloadFromCookie from "./getAuthenticationPayloadFromCookie"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context
    const connection = getConnection()

    const authToken = getAuthenticationPayloadFromCookie(req)
    let currentUser: User | null = null

    if (authToken && (await isTokenIdValid(connection, authToken.id))) {
      const user = await getUserByEmailAddress(connection, authToken.emailAddress)

      if (isSuccess(user)) {
        currentUser = user
      } else {
        logger.error(user)
      }
    }

    return getServerSidePropsFunction({
      ...context,
      currentUser,
      authentication: authToken
    } as AuthenticationServerSidePropsContext)
  }

  return result
}
