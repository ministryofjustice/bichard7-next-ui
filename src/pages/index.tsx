/* eslint-disable filenames/match-exported */
import CourtCaseList from "components/CourtCaseList"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import styles from "../styles/Home.module.css"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext
    return Promise.resolve({
      props: {
        username: currentUser?.username,
        visibleForces: currentUser?.visibleForces?.split(/[, ]/)
      }
    })
  }
)

interface Props {
  username?: string
  visibleForces?: string[]
}

const Home: NextPage = ({ username, visibleForces }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{"Case List | Bichard7"}</title>
        <meta name="description" content="Case List | Bichard7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{`Welcome to ${username}`}</h1>
        <CourtCaseList courtCases={[]}></CourtCaseList>
      </main>
    </div>
  )
}

export default Home
