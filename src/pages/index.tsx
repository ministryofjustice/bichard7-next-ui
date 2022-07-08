import DateTime from "components/DateTime"
import Layout from "components/Layout"
import CourtCase from "entities/CourtCase"
import User from "entities/User"
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
  user: User
  courtCases: CourtCase[]
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const dataSource = await getDataSource()
    const courtCases = await listCourtCases(dataSource, currentUser.visibleForces, 100)

    if (isError(courtCases)) {
      throw courtCases
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCases: courtCases.map((courtCase) => courtCase.serialize())
      }
    }
  }
)

const Home: NextPage<Props> = ({ user, courtCases }: Props) => {
  const tableHead = (
    <Table.Row>
      <Table.CellHeader>{"Court Date"}</Table.CellHeader>
      <Table.CellHeader>{"PTIURN"}</Table.CellHeader>
      <Table.CellHeader>{"Defendant Name"}</Table.CellHeader>
      <Table.CellHeader>{"Court Name"}</Table.CellHeader>
    </Table.Row>
  )
  const tableBody = courtCases.map((courtCase, idx) => {
    return (
      <Table.Row key={idx}>
        <Table.Cell>{courtCase.courtDate && <DateTime date={courtCase.courtDate} />}</Table.Cell>
        <Table.Cell>{courtCase.ptiurn}</Table.Cell>
        <Table.Cell>{courtCase.defendantName}</Table.Cell>
        <Table.Cell>{courtCase.courtName}</Table.Cell>
      </Table.Row>
    )
  })

  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
      </Head>

      <Layout user={user}>
        <Table caption={`${courtCases?.length} court cases for ${user.username}`} head={tableHead}>
          {tableBody}
        </Table>
      </Layout>
    </>
  )
}

export default Home
