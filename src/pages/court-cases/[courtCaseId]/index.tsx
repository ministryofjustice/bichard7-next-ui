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
import getCourtCase from "useCases/getCourtCase"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()
    const courtCase = await getCourtCase(dataSource, parseInt(courtCaseId, 10), currentUser.visibleForces)

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: isError(courtCase) || !courtCase ? null : courtCase.serialize()
      }
    }
  }
)

interface Props {
  user: User
  courtCase?: CourtCase
}

const CourtCaseDetails: NextPage<Props> = ({ courtCase, user }: Props) => {
  return (
    <>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout user={user}>
        <Table>
          {courtCase?.triggers &&
            courtCase.triggers.map((trigger, index) => (
              <Table.Row key={index}>
                <Table.Cell>{trigger.triggerId}</Table.Cell>
                <Table.Cell>{trigger.triggerCode}</Table.Cell>
              </Table.Row>
            ))}
        </Table>
      </Layout>
    </>
  )
}

export default CourtCaseDetails
