import CourtCaseList from "../components/CourtCaseList"
import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import User from "entities/User"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import listCourtCases from "useCases/listCourtCases"
import { QueryOrder } from "types/CaseListQueryParams"
import { InputField, Link } from "govuk-react"

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

const SearchForDefendant = () => {
  return (
    <div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third" id="search-defendant-name">
          <InputField
            input={{
              name: "group0"
            }}
          >
            {"Defendant Name"}
          </InputField>
        </div>
        <Link href={`/bichard/?defendantName=Bruce`} id="search_button_homepage" className="Button">
          {"Court Date"}
        </Link>
      </div>
    </div>
  )
}

const Home: NextPage<Props> = ({ user, courtCases, order }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <SearchForDefendant />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
