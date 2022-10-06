import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import CourtCaseLock from "features/CourtCaseLock/CourtCaseLock"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPNCUpdateDatasetXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import getCourtCaseByVisibleForce from "services/getCourtCaseByVisibleForce"
import { isError } from "types/Result"
import { isPost } from "utils/http"
import { UpdateResult } from "typeorm"
import resolveTrigger from "services/resolveTrigger"
import { resubmitCourtCase } from "services/resubmitCourtCase"
import parseFormData from "utils/parseFormData"
import { BackLink, Heading } from "govuk-react"
import { useRouter } from "next/router"
import { isPncUpdateDataset } from "utils/isPncUpdateDataset"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as AuthenticationServerSidePropsContext
    const {
      courtCaseId,
      lock,
      resolveTrigger: triggerToResolve,
      resubmitCase
    } = query as { courtCaseId: string; lock: string; resolveTrigger: string; resubmitCase: string }
    const dataSource = await getDataSource()

    let lockResult: UpdateResult | Error | undefined

    if (isPost(req) && !!lock) {
      if (lock === "true") {
        lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser)
      } else if (lock === "false") {
        lockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser)
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

    if (isPost(req) && resubmitCase === "true") {
      const { amendments } = (await parseFormData(req)) as { amendments: string }

      const parsedAmendments = amendments ? JSON.parse(amendments) : { noUpdatesResubmit: true }

      const amendedCase = await resubmitCourtCase(dataSource, parsedAmendments, +courtCaseId, currentUser)

      if (isError(amendedCase)) {
        throw amendedCase
      }
    }

    const courtCase = await getCourtCaseByVisibleForce(dataSource, +courtCaseId, currentUser.visibleForces)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    let annotatedHearingOutcome: AnnotatedHearingOutcome | Error

    if (isPncUpdateDataset(courtCase.hearingOutcome)) {
      const pncUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(courtCase.hearingOutcome)

      if (isError(pncUpdateDataset)) {
        console.error(`Failed to parse AnnotatedPNCUpdateDatasetXml: ${pncUpdateDataset}`)

        annotatedHearingOutcome = pncUpdateDataset
      } else {
        annotatedHearingOutcome = pncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
      }
    } else {
      annotatedHearingOutcome = parseAhoXml(courtCase.hearingOutcome)

      if (isError(annotatedHearingOutcome)) {
        console.error(`Failed to parse aho: ${annotatedHearingOutcome}`)
      }
    }

    return {
      props: {
        user: currentUser.serialize(),
        triggersVisible: currentUser.canLockTriggers,
        courtCase: courtCase.serialize(),
        aho: JSON.parse(JSON.stringify(annotatedHearingOutcome)),
        lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  lockedByAnotherUser: boolean
  triggersVisible: boolean
}

const CourtCaseDetailsPage: NextPage<Props> = ({
  courtCase,
  aho,
  user,
  lockedByAnotherUser,
  triggersVisible
}: Props) => {
  const { basePath } = useRouter()
  return (
    <>
      <Layout user={user}>
        <Heading as="h1" size="LARGE" aria-label="Case details">
          <title>{"Case Details | Bichard7"}</title>
          <meta name="description" content="Case Details | Bichard7" />
          <link rel="icon" href="/favicon.ico" />
        </Heading>
        <BackLink href={`${basePath}`} onClick={function noRefCheck() {}}>
          {"Cases"}
        </BackLink>
        <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={lockedByAnotherUser} />
        <CourtCaseDetails
          courtCase={courtCase}
          aho={aho}
          lockedByAnotherUser={lockedByAnotherUser}
          triggersVisible={triggersVisible}
        />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
