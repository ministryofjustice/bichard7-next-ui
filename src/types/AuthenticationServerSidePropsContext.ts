import type User from "entities/User"
import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"

type AuthenticationServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser?: Partial<User>
}

export default AuthenticationServerSidePropsContext
