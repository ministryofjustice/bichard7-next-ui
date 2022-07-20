import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import User from "entities/User"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { QueryOrder } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import listCourtCases from "useCases/listCourtCases"
import CourtCaseList from "../components/CourtCaseList"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, defendantName } = query as { orderBy: string; defendantName: string }
    let { order } = query as { order: string }

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      limit: 100,
      orderBy: orderBy,
      order: order as QueryOrder,
      defendantName: defendantName
    })

    if (isError(courtCases)) {
      throw courtCases
    }

    if (order === "ASC") {
      order = "DESC"
    } else {
      order = "ASC"
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCases: courtCases.map((courtCase) => courtCase.serialize()),
        order: order as QueryOrder
      }
    }
  }
)

const SearchForDefendant = (props: { url: string }) => (
  <div>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <form action={props.url} method="get">
          <label htmlFor="defendant">{"Defendant name"}</label>
          <input type="text" id="search-defendant-name" name="defendant" />
          <input type="submit" id="search_button_homepage" />
        </form>
      </div>
    </div>
  </div>
)

const Home: NextPage<Props> = ({ user, courtCases, order }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <SearchForDefendant url="" />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
