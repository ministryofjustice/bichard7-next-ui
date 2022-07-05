import User from "entities/User"
import getDataSource from "lib/getDataSource"
import parseJwtCookie from "lib/parseJwtCookie"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const { username } = parseJwtCookie(req)
    const dataSource = await getDataSource()

    const currentUser = (await dataSource
      .getRepository(User)
      .findOneBy({ username })
      .catch((error) => error)) as PromiseResult<User | null>

    if (isError(currentUser) || !currentUser) {
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
