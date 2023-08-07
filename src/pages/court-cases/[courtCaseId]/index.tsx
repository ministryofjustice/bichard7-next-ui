/* eslint-disable @typescript-eslint/no-throw-literal */
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import addNote from "services/addNote"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import resolveTriggers from "services/resolveTriggers"
import resubmitCourtCase from "services/resubmitCourtCase"
import lockCourtCase from "services/lockCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import { UpdateResult } from "typeorm"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { isPost } from "utils/http"
import notSuccessful from "utils/notSuccessful"
import parseFormData from "utils/parseFormData"
import parseHearingOutcome from "../../../utils/parseHearingOutcome"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query } = context as AuthenticationServerSidePropsContext
    const { courtCaseId, lock, resolveTrigger, resubmitCase } = query as {
      courtCaseId: string
      lock: string
      resolveTrigger: string | string[] | undefined
      resubmitCase: string
    }
    const dataSource = await getDataSource()

    let lockResult: UpdateResult | Error | undefined

    if (isPost(req) && lock === "false") {
      lockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser, UnlockReason.TriggerAndException)
    } else {
      lockResult = await lockCourtCase(dataSource, +courtCaseId, currentUser)
    }

    if (isError(lockResult)) {
      throw lockResult
    }

    const triggersToResolve = []
    if (typeof resolveTrigger === "string" && !Number.isNaN(+resolveTrigger)) {
      triggersToResolve.push(+resolveTrigger)
    } else if (Array.isArray(resolveTrigger)) {
      resolveTrigger.map((triggerId) => {
        if (!Number.isNaN(+triggerId)) {
          triggersToResolve.push(+triggerId)
        }
      })
    }

    if (isPost(req) && triggersToResolve.length > 0) {
      const updateTriggerResult = await resolveTriggers(
        dataSource,
        triggersToResolve.map((triggerId) => +triggerId),
        +courtCaseId,
        currentUser
      ).catch((error) => error)

      if (isError(updateTriggerResult)) {
        throw updateTriggerResult
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
        const { isSuccessful, ValidationException, Exception } = await addNote(
          dataSource,
          +courtCaseId,
          currentUser.username,
          noteText
        )
        if (!isSuccessful) {
          return notSuccessful(ValidationException || Exception?.message || "")
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

    const annotatedHearingOutcome = parseHearingOutcome(courtCase.hearingOutcome)

    return {
      props: {
        user: currentUser.serialize(),
        courtCase: courtCase.serialize(),
        aho: JSON.parse(JSON.stringify(annotatedHearingOutcome)),
        errorLockedByAnotherUser: courtCase.exceptionsAreLockedByAnotherUser(currentUser.username),
        canReallocate: courtCase.canReallocate(currentUser.username)
      }
    }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  errorLockedByAnotherUser: boolean
  canReallocate: boolean
}

const CourtCaseDetailsPage: NextPage<Props> = ({
  courtCase,
  aho,
  user,
  errorLockedByAnotherUser,
  canReallocate
}: Props) => {
  return (
    <>
      <Head>
        <title>{"Case Details | Bichard7"}</title>
        <meta name="description" content="Case Details | Bichard7" />
      </Head>
      <Layout
        user={user}
        bichardSwitch={{ display: true, href: `/bichard-ui/SelectRecord?unstick=true&error_id=${courtCase.errorId}` }}
      >
        <CourtCaseDetails
          courtCase={courtCase}
          aho={aho}
          user={user}
          errorLockedByAnotherUser={errorLockedByAnotherUser}
          canReallocate={canReallocate}
        />
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage
