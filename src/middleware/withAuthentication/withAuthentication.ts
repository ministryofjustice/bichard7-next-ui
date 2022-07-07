import User from "../../entities/User"
import getDataSource from "lib/getDataSource"
import parseJwtCookie from "lib/parseJwtCookie"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError, Result } from "types/Result"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const authJwt = parseJwtCookie(req)
    let currentUser: Result<User | null> = null

    if (authJwt) {
      const dataSource = await getDataSource()
      currentUser = await dataSource
        .getRepository(User)
        .findOneBy({ username: authJwt.username })
        .catch((error) => error)
    }

    if (!currentUser || isError(currentUser)) {
      res.statusCode = 401
      res.statusMessage = "Unauthorized"
      res.end()
      return { props: {} } as unknown as GetServerSidePropsResult<Props>
    }

    return getServerSidePropsFunction({
      ...context,
      currentUser
    } as AuthenticationServerSidePropsContext)
  }

  return result
}
