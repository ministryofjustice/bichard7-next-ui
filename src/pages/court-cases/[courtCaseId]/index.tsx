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
import getCourtCase from "useCases/getCourtCase"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }
    const dataSource = await getDataSource()
    const courtCase = await getCourtCase(dataSource, parseInt(courtCaseId, 10), currentUser.visibleForces)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

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
        <Table head={<h2>{"Case Details"}</h2>}>
          <Table.Row>
            <Table.CellHeader>{"PTIURN"}</Table.CellHeader>
            <Table.Cell>{courtCase?.ptiurn}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>{"Court name"}</Table.CellHeader>
            <Table.Cell>{courtCase?.courtName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>{"Court date"}</Table.CellHeader>
            <Table.Cell>{courtCase?.courtDate?.toString()}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>{"Defendant name"}</Table.CellHeader>
            <Table.Cell>{courtCase?.defendantName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>{"Exception reason"}</Table.CellHeader>
            <Table.Cell>{courtCase?.errorReason}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>{"Trigger reason"}</Table.CellHeader>
            <Table.Cell>{courtCase?.triggerReason}</Table.Cell>
          </Table.Row>
        </Table>
        <Table head={<h2>{"Triggers"}</h2>}>
          <Table.Row>
            <Table.CellHeader>{"ID"}</Table.CellHeader>
            <Table.CellHeader>{"Code"}</Table.CellHeader>
            <Table.CellHeader>{"Resolved by"}</Table.CellHeader>
            <Table.CellHeader>{"Resolved at"}</Table.CellHeader>
          </Table.Row>
          {courtCase?.triggers &&
            courtCase.triggers.map((trigger, index) => (
              <Table.Row key={index}>
                <Table.Cell>{trigger.triggerId}</Table.Cell>
                <Table.Cell>{trigger.triggerCode}</Table.Cell>
                <Table.Cell>{trigger.resolvedBy}</Table.Cell>
                <Table.Cell>{trigger.resolvedAt?.toString()}</Table.Cell>
              </Table.Row>
            ))}
        </Table>
        <Table head={<h2>{"Notes"}</h2>}>
          {courtCase?.notes &&
            courtCase.notes.map((note, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <DateTime date={note.createdAt} />
                </Table.Cell>
                <Table.Cell>{note.noteText}</Table.Cell>
              </Table.Row>
            ))}
        </Table>
      </Layout>
    </>
  )
}

export default CourtCaseDetails
