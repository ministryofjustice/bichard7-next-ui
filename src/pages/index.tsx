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
import { Filter, QueryOrder } from "types/CaseListQueryParams"
import { Button, GridCol, GridRow, Link, Select } from "govuk-react"
import { useState } from "react"

interface Props {
  user: User
  courtCases: CourtCase[]
  order: QueryOrder
  filter?: Filter
}

const queryParamToFilterState = (value: string) =>
  (value === "TRIGGERS" || value === "EXCEPTIONS" ? value : undefined) as Filter

const FilterCases = (props: { initialSelection: Filter }) => {
  const [currentSelection, setCurrentSelection] = useState(props.initialSelection)

  return (
    <GridRow>
      <GridCol>
        <Select
          label={"Filter cases"}
          input={{
            value: currentSelection,
            onChange: (e) => setCurrentSelection(queryParamToFilterState(e.target.value))
          }}
        >
          <option value={""} selected={!currentSelection}>
            {"Show all cases"}
          </option>
          <option value={"TRIGGERS"} selected={currentSelection === "TRIGGERS"}>
            {"Show only cases with triggers"}
          </option>
          <option value={"EXCEPTIONS"} selected={currentSelection === "EXCEPTIONS"}>
            {"Show only cases with exceptions"}
          </option>
        </Select>
      </GridCol>
      <GridCol>
        <Link href={`/bichard?filter=${currentSelection}`}>
          <Button>{"Filter"}</Button>
        </Link>
      </GridCol>
    </GridRow>
  )
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { orderBy, order, filter } = query as { orderBy: string; order: string; filter: string }
    const caseFilter = queryParamToFilterState(filter)

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, {
      forces: currentUser.visibleForces,
      limit: 100,
      orderBy: orderBy,
      order: order as QueryOrder,
      filter: caseFilter
    })

    if (isError(courtCases)) {
      throw courtCases
    }

    const oppositeOrder: QueryOrder = order === "ASC" ? "DESC" : "ASC"

    const props: Props = {
      user: currentUser.serialize(),
      courtCases: courtCases.map((courtCase) => courtCase.serialize()),
      order: oppositeOrder
    }

    if (caseFilter) {
      props.filter = caseFilter
    }

    return { props }
  }
)

const Home: NextPage<Props> = ({ user, courtCases, order, filter }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <FilterCases initialSelection={filter} />
        <CourtCaseList courtCases={courtCases} order={order} />
      </Layout>
    </>
  )
}

export default Home
