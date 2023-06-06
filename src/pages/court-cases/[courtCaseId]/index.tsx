/* eslint-disable @typescript-eslint/no-throw-literal */
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPNCUpdateDatasetXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import CourtCaseLock from "features/CourtCaseLock/CourtCaseLock"
import { BackLink } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Error from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import addNote from "services/addNote"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import resolveTrigger from "services/resolveTrigger"
import { resubmitCourtCase } from "services/resubmitCourtCase"
import tryToLockCourtCase from "services/tryToLockCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import { UpdateResult } from "typeorm"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { isPost } from "utils/http"
import { isPncUpdateDataset } from "utils/isPncUpdateDataset"
import parseFormData from "utils/parseFormData"

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
      if (lock === "false") {
        lockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser)
      } else {
        lockResult = await tryToLockCourtCase(dataSource, +courtCaseId, currentUser)
      }
    }

    if (isError(lockResult)) {
      throw lockResult
    }

    if (isPost(req) && !!triggerToResolve) {
      const updateTriggerResult = await resolveTrigger(dataSource, +triggerToResolve, +courtCaseId, currentUser)

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

    if (isPost(req)) {
      const { noteText } = (await parseFormData(req)) as { noteText: string }
      if (noteText) {
        const addNoteResult = await addNote(dataSource, +courtCaseId, currentUser.username, noteText)
        if (!addNoteResult) {
          return {
            isSuccessful: false,
            ValidationException: "Case is locked by another user"
          }
        }
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
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, aho, user, lockedByAnotherUser }: Props) => {
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
        <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={lockedByAnotherUser} />
        <CourtCaseDetails courtCase={courtCase} aho={aho} lockedByAnotherUser={lockedByAnotherUser} />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
