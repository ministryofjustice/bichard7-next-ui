/* eslint-disable @typescript-eslint/no-throw-literal */
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import ConditionalDisplay from "components/ConditionalDisplay"
import Layout from "components/Layout"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { createUseStyles } from "react-jss"
import addNote from "services/addNote"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import lockCourtCase from "services/lockCourtCase"
import resolveTriggers from "services/resolveTriggers"
import resubmitCourtCase from "services/resubmitCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import { UpdateResult } from "typeorm"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import notSuccessful from "utils/notSuccessful"
import parseFormData from "utils/parseFormData"
import Feature from "../../../types/Feature"
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

    const loadLockedBy = true

    let courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    let lockResult: UpdateResult | Error | undefined

    if (isPost(req) && lock === "false") {
      lockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser, UnlockReason.TriggerAndException)
    } else if (currentUser.hasAccessTo[Feature.Exceptions] || currentUser.hasAccessTo[Feature.Triggers]) {
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

    // Fetch the record from the database after updates
    courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

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
        user: userToDisplayFullUserDto(currentUser),
        courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase),
        aho: JSON.parse(JSON.stringify(annotatedHearingOutcome)),
        errorLockedByAnotherUser: courtCase.exceptionsAreLockedByAnotherUser(currentUser.username),
        canReallocate: courtCase.canReallocate(currentUser.username)
      }
    }
  }
)

interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  aho: AnnotatedHearingOutcome
  errorLockedByAnotherUser: boolean
  canReallocate: boolean
}

const useStyles = createUseStyles({
  attentionContainer: {
    marginTop: "0.3rem",
    marginRight: "100rem",
    width: "100%"
  },
  attentionBanner: {
    textTransform: "none",
    fontWeight: 300
  }
})

const CourtCaseDetailsPage: NextPage<Props> = ({
  courtCase,
  aho,
  user,
  errorLockedByAnotherUser,
  canReallocate
}: Props) => {
  const classes = useStyles()
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
        <ConditionalDisplay isDisplayed={courtCase.phase != 1}>
          <div className={`${classes.attentionContainer} govuk-tag govuk-!-width-full`}>
            <div className="govuk-tag">{"Attention:"}</div>
            <div className={`${classes.attentionBanner} govuk-tag`}>
              {
                "This case can not be reallocated within new bichard; Switch to the old bichard to reallocate this case."
              }
            </div>
          </div>
        </ConditionalDisplay>
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
