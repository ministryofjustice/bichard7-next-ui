import ConditionalRender from "components/ConditionalRender"
import FeedbackHeaderLinks from "components/FeedbackHeaderLinks"
import Layout from "components/Layout"
import RadioButton from "components/RadioButton/RadioButton"
import { MAX_FEEDBACK_LENGTH } from "config"
import { Button, Fieldset, FormGroup, Heading, HintText, MultiChoice, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { useCallback, useEffect, useState } from "react"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { SurveyFeedbackType, SwitchingFeedbackResponse } from "types/SurveyFeedback"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"
import Form from "../components/Form"
import withCsrf from "../middleware/withCsrf/withCsrf"

interface SwitchingFeedbackFormState {
  issueOrPreference?: string
  caseListOrDetail?: string
  feedback?: string
}
interface Props {
  user: DisplayFullUser
  csrfToken: string
  previousPath: string
  fields?: {
    issueOrPreference: {
      hasError: boolean
      value?: string | null
    }
    caseListOrDetail: {
      hasError: boolean
      value?: string | null
    }
    feedback: {
      hasError: boolean
      value?: string | null
    }
  }
}

function validateForm(form: SwitchingFeedbackFormState): boolean {
  const isIssueOrPreferenceValid =
    !!form.issueOrPreference && ["issue", "preference", "other"].includes(form.issueOrPreference)
  const isCaseListOrDetailValid =
    form.issueOrPreference !== "issue" ||
    (!!form.caseListOrDetail && ["caselist", "casedetail"].includes(form.caseListOrDetail))
  const isFeedbackValid = !!form.feedback

  return isIssueOrPreferenceValid && isCaseListOrDetailValid && isFeedbackValid
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, csrfToken, formData } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const {
      previousPath,
      isSkipped,
      redirectTo: redirectToUrl
    } = query as { previousPath?: string; isSkipped?: string; redirectTo?: string }

    if (!redirectToUrl) {
      throw new Error("no redirectTo URL")
    }

    const props = {
      user: userToDisplayFullUserDto(currentUser),
      previousPath: previousPath || "../bichard",
      csrfToken
    }

    if (isPost(req)) {
      const dataSource = await getDataSource()

      const form = formData as SwitchingFeedbackFormState

      if (isSkipped === "true") {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          userId: currentUser.id,
          response: { skipped: true } as SwitchingFeedbackResponse
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(redirectToUrl)
        } else {
          throw result
        }
      }

      if (validateForm(form)) {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          userId: currentUser.id,
          response: form as SwitchingFeedbackFormState
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(redirectToUrl)
        } else {
          throw result
        }
      } else {
        return {
          props: {
            ...props,
            fields: {
              issueOrPreference: {
                hasError: !form.issueOrPreference ? true : false,
                value: form.issueOrPreference ?? null
              },
              caseListOrDetail: {
                hasError: !form.caseListOrDetail ? true : false,
                value: form.caseListOrDetail ?? null
              },
              feedback: { hasError: !form.feedback ? true : false, value: form.feedback ?? null }
            }
          }
        }
      }
    }

    return { props }
  }
)

const SwitchingFeedbackPage: NextPage<Props> = ({ user, previousPath, fields, csrfToken }: Props) => {
  const [skipUrl, setSkipUrl] = useState<URL | null>(null)

  const [formState, setFormState] = useState<SwitchingFeedbackFormState>({
    feedback: fields?.feedback.value ?? undefined,
    issueOrPreference: fields?.issueOrPreference.value ?? undefined,
    caseListOrDetail: fields?.caseListOrDetail.value ?? undefined
  })
  const handleFormChange = useCallback(
    <T extends keyof SwitchingFeedbackFormState>(field: T, value: SwitchingFeedbackFormState[T]) => {
      setFormState({
        ...formState,
        [field]: value
      })
    },
    [formState, setFormState]
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.append("isSkipped", "true")
    setSkipUrl(url)
  }, [])

  const getRemainingLength = useCallback(
    () => MAX_FEEDBACK_LENGTH - (formState.feedback?.length || 0),
    [formState.feedback]
  )

  return (
    <Layout user={user}>
      <Heading as="h2" size="LARGE" aria-label="Switching Feedback">
        <title>{"Report an issue using new Bichard | Bichard7"}</title>
        <meta name="description" content="user switching version feedback| Bichard7" />
      </Heading>

      <FeedbackHeaderLinks backLinkUrl={previousPath} skipLinkUrl={skipUrl?.search} />

      <Heading as="h1">{"Share your feedback"}</Heading>

      <Form method="POST" action={"#"} csrfToken={csrfToken}>
        <Fieldset>
          <p className="govuk-body">
            {
              "You have selected to revert back to old Bichard. What was the reason for doing so? Can you please select the appropriate option. And outline the problem that occurred below so that we can best understand."
            }
          </p>
        </Fieldset>
        <Fieldset>
          <FormGroup id="issueOrPreference">
            <Heading as="h3" size="SMALL">
              {"Why have you decided to switch version of Bichard?"}
            </Heading>
            <Heading as="h5" size="SMALL">
              {"Select one of the below option."}
            </Heading>
            <MultiChoice
              label={""}
              meta={{
                error: "Select one of the below options",
                touched: fields?.issueOrPreference.hasError
              }}
            >
              <RadioButton
                name={"issueOrPreference"}
                id={"issueOrPreference-issue"}
                defaultChecked={fields?.issueOrPreference.value === "issue"}
                value={"issue"}
                onChange={() => handleFormChange("issueOrPreference", "issue")}
                label={
                  "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task."
                }
              />
              <RadioButton
                name={"issueOrPreference"}
                id={"issueOrPreference-preference"}
                defaultChecked={fields?.issueOrPreference.value === "preference"}
                value={"preference"}
                onChange={() => handleFormChange("issueOrPreference", "preference")}
                label={"I prefer working in the old version, and I dislike working in the new version."}
              />
              <RadioButton
                name={"issueOrPreference"}
                id={"issueOrPreference-other"}
                defaultChecked={fields?.issueOrPreference.value === "other"}
                value={"other"}
                onChange={() => handleFormChange("issueOrPreference", "other")}
                label={"Other (please specify)"}
              />
            </MultiChoice>
          </FormGroup>
          <ConditionalRender isRendered={formState.issueOrPreference === "issue"}>
            <FormGroup id="caseListOrDetail">
              <Heading as="h3" size="SMALL">
                {"Which page were you finding an issue with?"}
              </Heading>
              <Heading as="h5" size="SMALL">
                {"Select one of the below option."}
              </Heading>
              <MultiChoice
                label={""}
                meta={{
                  error: "Select one of the below options",
                  touched: fields?.caseListOrDetail.hasError
                }}
              >
                <RadioButton
                  name={"caseListOrDetail"}
                  id={"caseListOrDetail-caselist"}
                  defaultChecked={fields?.caseListOrDetail.value === "caselist"}
                  value={"caselist"}
                  label={"Case list page"}
                  onChange={() => handleFormChange("caseListOrDetail", "caselist")}
                />
                <RadioButton
                  name={"caseListOrDetail"}
                  id={"caseListOrDetail-casedetail"}
                  defaultChecked={fields?.caseListOrDetail.value === "casedetail"}
                  value={"casedetail"}
                  onChange={() => handleFormChange("caseListOrDetail", "casedetail")}
                  label={"Case details page"}
                />
              </MultiChoice>
            </FormGroup>
            <FormGroup id="otherFeedback">
              <Heading as="h3" size="SMALL">
                {"Could you explain in detail what problem you have experienced?"}
              </Heading>
              <TextArea
                input={{
                  name: "feedback",
                  defaultValue: fields?.feedback.value ?? undefined,
                  rows: 5,
                  maxLength: MAX_FEEDBACK_LENGTH,
                  onChange: (e) => handleFormChange("feedback", e.currentTarget.value)
                }}
                meta={{
                  error: "Input message into the text box",
                  touched: fields?.feedback.hasError
                }}
                hint="Tell us why you have made this selection."
              >
                {""}
              </TextArea>

              <HintText>{`You have ${getRemainingLength()} characters remaining`}</HintText>
            </FormGroup>
          </ConditionalRender>
          <ConditionalRender isRendered={formState.issueOrPreference === "preference"}>
            <FormGroup id="versionPreferenceFeedback">
              <Heading as="h3" size="SMALL">
                {
                  "Could you please explain why you prefer using the old version of Bichard over the new version Bichard?"
                }
              </Heading>
              <TextArea
                input={{
                  name: "feedback",
                  defaultValue: fields?.feedback.value ?? undefined,
                  rows: 5,
                  maxLength: MAX_FEEDBACK_LENGTH,
                  onChange: (e) => handleFormChange("feedback", e.currentTarget.value)
                }}
                meta={{
                  error: "Input message into the text box",
                  touched: fields?.feedback.hasError
                }}
                hint="Tell us why you have made this selection."
              >
                {""}
              </TextArea>

              <HintText>{`You have ${getRemainingLength()} characters remaining`}</HintText>
            </FormGroup>
          </ConditionalRender>
          <ConditionalRender isRendered={formState.issueOrPreference === "other"}>
            <FormGroup id="otherReasonFeedback">
              <Heading as="h3" size="SMALL">
                {"Is there another reason why you are switching version of Bichard?"}
              </Heading>
              <TextArea
                input={{
                  name: "feedback",
                  defaultValue: fields?.feedback.value ?? undefined,
                  rows: 5,
                  maxLength: MAX_FEEDBACK_LENGTH,
                  onChange: (e) => handleFormChange("feedback", e.currentTarget.value)
                }}
                meta={{
                  error: "Input message into the text box",
                  touched: fields?.feedback.hasError
                }}
                hint="Tell us why you have made this selection."
              >
                {""}
              </TextArea>

              <HintText>{`You have ${getRemainingLength()} characters remaining`}</HintText>
            </FormGroup>
          </ConditionalRender>

          <ConditionalRender isRendered={Boolean(formState.issueOrPreference)}>
            <FormGroup>
              <Button type="submit">{"Send feedback and continue"}</Button>
            </FormGroup>
          </ConditionalRender>
        </Fieldset>
      </Form>
    </Layout>
  )
}

export default SwitchingFeedbackPage
