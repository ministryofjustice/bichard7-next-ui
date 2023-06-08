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
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import { isError } from "types/Result"
import { isPost } from "utils/http"
import { UpdateResult } from "typeorm"
import resolveTriggers from "services/resolveTriggers"
import { resubmitCourtCase } from "services/resubmitCourtCase"
import parseFormData from "utils/parseFormData"
import { BackLink } from "govuk-react"
import { useRouter } from "next/router"
import { isPncUpdateDataset } from "utils/isPncUpdateDataset"
import Head from "next/head"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as AuthenticationServerSidePropsContext
    const {
      courtCaseId,
      lock,
      resolveTrigger: triggersToResolve,
      resubmitCase
    } = query as { courtCaseId: string; lock: string; resolveTrigger: string[]; resubmitCase: string }
    const dataSource = await getDataSource()

    let lockResult: UpdateResult | Error | undefined

    if (isPost(req) && !!lock) {
      if (lock === "false") {
        lockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser)
      } else {
        lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser)
      }
    }

    if (isError(lockResult)) {
      throw lockResult
    }

    if (isPost(req) && triggersToResolve.length > 0) {
      const updateTriggerResult = await resolveTriggers(
        dataSource,
        triggersToResolve.map((triggerId) => +triggerId),
        +courtCaseId,
        currentUser
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

      const parsedAmendments = JSON.parse(amendments)

      const updatedAmendments =
        Object.keys(parsedAmendments).length > 0 ? parsedAmendments : { noUpdatesResubmit: true }

      const amendedCase = await resubmitCourtCase(dataSource, updatedAmendments, +courtCaseId, currentUser)

      if (isError(amendedCase)) {
        throw amendedCase
      }
    }

    const courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser)

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
        courtCase: courtCase.serialize(),
        aho: JSON.parse(JSON.stringify(annotatedHearingOutcome)),
        errorLockedByAnotherUser: courtCase.errorIsLockedByAnotherUser(currentUser.username),
        triggersLockedByCurrentUser: courtCase.triggersAreLockedByCurrentUser(currentUser.username),
        triggersLockedByUser: courtCase.triggerLockedByUsername ?? null
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  errorLockedByAnotherUser: boolean
  triggersLockedByCurrentUser: boolean
  triggersLockedByUser: string | null
}

const CourtCaseDetailsPage: NextPage<Props> = ({
  courtCase,
  aho,
  user,
  errorLockedByAnotherUser,
  triggersLockedByCurrentUser,
  triggersLockedByUser
}: Props) => {
  const { basePath } = useRouter()
  return (
    <>
      <Head>
        <title>{"Case Details | Bichard7"}</title>
        <meta name="description" content="Case Details | Bichard7" />
      </Head>
      <Layout user={user}>
        <BackLink href={`${basePath}`} onClick={function noRefCheck() {}}>
          {"Cases"}
        </BackLink>
        <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={errorLockedByAnotherUser} />
        <CourtCaseDetails
          courtCase={courtCase}
          aho={aho}
          errorLockedByAnotherUser={errorLockedByAnotherUser}
          triggersLockedByCurrentUser={triggersLockedByCurrentUser}
          triggersLockedByUser={triggersLockedByUser}
        />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
