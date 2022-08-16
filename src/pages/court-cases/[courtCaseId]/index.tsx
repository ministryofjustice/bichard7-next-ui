import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import CourtCaseLock from "features/CourtCaseLock/CourtCaseLock"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import getCourtCase from "services/getCourtCase"
import { isError } from "types/Result"
import { isPost } from "utils/http"
import { UpdateResult } from "typeorm"
import resolveTrigger from "services/resolveTrigger"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as AuthenticationServerSidePropsContext
    const {
      courtCaseId,
      lock,
      resolveTrigger: triggerToResolve
    } = query as { courtCaseId: string; lock: string; resolveTrigger: string }
    const dataSource = await getDataSource()

    let lockResult: UpdateResult | Error | undefined

    if (isPost(req)) {
      if (!!lock && lock === "true") {
        lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser.username)
      } else if (!!lock && lock === "false") {
        lockResult = await unlockCourtCase(dataSource, +courtCaseId)
      }
    }

    if (isError(lockResult)) {
      throw lockResult
    }

    if (isPost(req) && !!triggerToResolve) {
      const updateTriggerResult = await resolveTrigger(
        dataSource,
        +triggerToResolve,
        +courtCaseId,
        currentUser.username,
        currentUser.visibleForces
      )

      if (isError(updateTriggerResult)) {
        throw updateTriggerResult
      }

      if (!updateTriggerResult) {
        throw new Error("Failed to resolve trigger")
      }
    }

    const courtCase = await getCourtCase(dataSource, +courtCaseId, currentUser.visibleForces)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    const lockedByAnotherUser =
      (!!courtCase.errorLockedById && courtCase.errorLockedById !== currentUser.username) ||
      (!!courtCase.triggerLockedById && courtCase.triggerLockedById !== currentUser.username)

    const aho = parseAhoXml(courtCase.hearingOutcome)
    if (isError(aho)) {
      console.error(`Failed to parse aho: ${aho}`)
    }

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCase.serialize(),
        aho: JSON.parse(JSON.stringify(aho)),
        lockedByAnotherUser
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  lockedByAnotherUser: boolean
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, aho, user, lockedByAnotherUser }: Props) => (
  <>
    <Head>
      <title>{"Case Details | Bichard7"}</title>
      <meta name="description" content="Case Details | Bichard7" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout user={user}>
      <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={lockedByAnotherUser} />
      <CourtCaseDetails courtCase={courtCase} aho={aho} />
    </Layout>
  </>
)

export default CourtCaseDetailsPage
