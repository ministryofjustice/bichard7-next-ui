import CourtCase from "entities/CourtCase"
import getDataSource from "lib/getDataSource"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { isError } from "types/Result"
import getCourtCase from "useCases/getCourtCase"
import styles from "../styles/Home.module.css"

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<Props>> => {
  const { query } = context
  const { courtCaseId } = query as { courtCaseId: string }
  const dataSource = await getDataSource()
  const courtCase = await getCourtCase(dataSource, parseInt(courtCaseId, 10), ["36FPA"])

  return {
    props: {
      courtCase: isError(courtCase) || !courtCase ? undefined : JSON.parse(JSON.stringify(courtCase))
    }
  }
}

interface Props {
  courtCase?: CourtCase
}

const Home: NextPage = ({ courtCase }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{JSON.stringify(courtCase)}</main>
    </div>
  )
}

export default Home
