import CourtCase from "entities/CourtCase"
import { Table } from "govuk-react"
import getDataSource from "lib/getDataSource"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import listCourtCases from "useCases/listCourtCases"

interface Props {
  username?: string
  courtCases?: CourtCase[]
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const visibleForces = currentUser?.visibleForces?.split(/[, ]/) || []
    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, visibleForces, 100)

    return {
      props: {
        username: currentUser?.username,
        courtCases: isError(courtCases) ? [] : JSON.parse(JSON.stringify(courtCases))
      }
    }
  }
)

const Home: NextPage = ({ username, courtCases }: Props) => {
  const tableHead = (
    <Table.Row>
      <Table.CellHeader>{"Court Date"}</Table.CellHeader>
      <Table.CellHeader>{"PTIURN"}</Table.CellHeader>
      <Table.CellHeader>{"Defendant Name"}</Table.CellHeader>
      <Table.CellHeader>{"Court Name"}</Table.CellHeader>
    </Table.Row>
  )
  const tableBody = courtCases?.map((courtCase, idx) => {
    return (
      <Table.Row key={idx}>
        <Table.Cell>{courtCase.courtDate}</Table.Cell>
        <Table.Cell>{courtCase.ptiurn}</Table.Cell>
        <Table.Cell>{courtCase.defendantName}</Table.Cell>
        <Table.Cell>{courtCase.courtName}</Table.Cell>
      </Table.Row>
    )
  })
  return (
    <div>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Table caption={`${courtCases?.length} court cases for ${username}`} head={tableHead}>
        {tableBody}
      </Table>
    </div>
  )
}

export default Home
