import Layout from "components/Layout"
import RadioButton from "components/RadioButton/RadioButton"
import { MAX_FEEDBACK_LENGTH } from "config"
import { BackLink, Button, Fieldset, FormGroup, Heading, HintText, MultiChoice, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useEffect, useState } from "react"
import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { SurveyFeedbackType, SwitchingFeedbackResponse } from "types/SurveyFeedback"
import { isPost } from "utils/http"
import parseFormData from "utils/parseFormData"
import redirectTo from "utils/redirectTo"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req } = context as AuthenticationServerSidePropsContext
    const {
      previousPath,
      isSkipped,
      redirectTo: redirectToUrl
    } = query as { previousPath: string; isSkipped: string; redirectTo: string }

    const dataSource = await getDataSource()

    const props = {
      user: currentUser.serialize(),
      previousPath: previousPath || "../bichard"
    }

    if (isPost(req)) {
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

      const { issueOrPreference, caseListOrDetail, componentIssue, otherFeedback } = (await parseFormData(req)) as {
        issueOrPreference: string
        caseListOrDetail: string
        componentIssue: string
        otherFeedback: string
        isSkipped: string
      }

      if (issueOrPreference && caseListOrDetail && componentIssue && otherFeedback) {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          userId: currentUser.id,
          response: { issueOrPreference, caseListOrDetail, componentIssue, otherFeedback } as SwitchingFeedbackResponse
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(redirectToUrl)
        } else {
          throw result
        }
      }

      return {
        props: {
          ...props,
          fields: {
            issueOrPreference: { hasError: !issueOrPreference ? true : false, value: issueOrPreference ?? null },
            caseListOrDetail: { hasError: !caseListOrDetail ? true : false, value: caseListOrDetail ?? null },
            componentIssue: { hasError: !componentIssue ? true : false, value: componentIssue ?? null },
            otherFeedback: { hasError: !otherFeedback ? true : false, value: otherFeedback }
          }
        }
      }
    }

    return { props }
  }
)

interface Props {
  user: User
  previousPath: string
  fields?: {
    issueOrPreference: {
      hasError: boolean
      value: string
    }
    caseListOrDetail: {
      hasError: boolean
      value: string
    }
    componentIssue: {
      hasError: boolean
      value: string
    }
    otherFeedback: {
      hasError: boolean
      value: string
    }
  }
}
const SwitchingFeedbackPage: NextPage<Props> = ({ user, previousPath, fields }: Props) => {
  const [remainingFeedbackLength, setRemainingFeedbackLength] = useState(MAX_FEEDBACK_LENGTH)
  const [skipUrl, setSkipUrl] = useState<URL | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.append("isSkipped", "true")
    setSkipUrl(url)
  }, [])

  const handleFeedbackOnChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setRemainingFeedbackLength(MAX_FEEDBACK_LENGTH - event.currentTarget.value.length)
  }

  return (
    <>
      <Layout user={user}>
        <Heading as="h2" size="LARGE" aria-label="Switching Feedback">
          <title>{"Report an issue using new Bichard | Bichard7"}</title>
          <meta name="description" content="user switching version feedback| Bichard7" />
        </Heading>
        <BackLink href={previousPath} onClick={function noRefCheck() {}}>
          {"Back"}
        </BackLink>
        {/* Todo: style button to match design*/}
        <form method="POST" action={skipUrl?.search}>
          <button type="submit">{"Skip feedback"}</button>
        </form>

        <Heading as="h1">{"Share your feedback"}</Heading>

        <form method="POST" action={"#"}>
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
                  label={
                    "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task."
                  }
                />
                <RadioButton
                  name={"issueOrPreference"}
                  id={"issueOrPreference-preference"}
                  defaultChecked={fields?.issueOrPreference.value === "preference"}
                  value={"preference"}
                  label={"I prefer working in the old version, and I dislike working in the new version."}
                />
                <RadioButton
                  name={"issueOrPreference"}
                  id={"issueOrPreference-other"}
                  defaultChecked={fields?.issueOrPreference.value === "other"}
                  value={"other"}
                  label={"Other (please specify)"}
                />
              </MultiChoice>
            </FormGroup>
            <FormGroup id="caseListOrDetail">
              <Heading as="h3" size="SMALL">
                {"Which page where you finding an issue with?"}
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
                />
                <RadioButton
                  name={"caseListOrDetail"}
                  id={"caseListOrDetail-casedetail"}
                  defaultChecked={fields?.caseListOrDetail.value === "casedetail"}
                  value={"casedetail"}
                  label={"Case details page"}
                />
              </MultiChoice>
            </FormGroup>
            <FormGroup id="otherFeedback">
              <TextArea
                input={{
                  name: "otherFeedback",
                  defaultValue: fields?.otherFeedback.value,
                  rows: 5,
                  maxLength: MAX_FEEDBACK_LENGTH,
                  onInput: handleFeedbackOnChange
                }}
                meta={{
                  error: "Input message into the text box",
                  touched: fields?.otherFeedback.hasError
                }}
                hint="Tell us why you have made this selection."
              >
                {""}
              </TextArea>

              <HintText>{`You have ${remainingFeedbackLength} characters remaining`}</HintText>
            </FormGroup>
            <FormGroup>
              <Button type="submit">{"Send feedback and continue"}</Button>
            </FormGroup>
          </Fieldset>
        </form>
      </Layout>
    </>
  )
}

export default SwitchingFeedbackPage
