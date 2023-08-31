import KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import Layout from "components/Layout"
import RadioButton from "components/RadioButton/RadioButton"
import { MAX_FEEDBACK_LENGTH } from "config"
import { BackLink, Button, Fieldset, FormGroup, Heading, HintText, MultiChoice, Paragraph, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { SurveyFeedbackResponse, SurveyFeedbackType } from "types/SurveyFeedback"
import { isPost } from "utils/http"
import parseFormData from "utils/parseFormData"
import redirectTo from "utils/redirectTo"

enum FeedbackExperienceKey {
  verySatisfied,
  satisfied,
  neutral,
  dissatisfied,
  veryDissatisfied
}

const FeedbackExperienceOptions: KeyValuePair<FeedbackExperienceKey, string> = {
  0: "Very satisfied",
  1: "Satisfied",
  2: "Neither satisfied nor dissatisfied",
  3: "Dissatisfied",
  4: "Very dissatisfied"
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req } = context as AuthenticationServerSidePropsContext
    const { previousPath } = query as { previousPath: string }

    const dataSource = await getDataSource()

    const props = {
      user: currentUser.serialize(),
      previousPath
    }

    if (isPost(req)) {
      const { isAnonymous, experience, feedback } = (await parseFormData(req)) as {
        isAnonymous: string
        experience: string
        feedback: string
      }

      if (isAnonymous && experience && feedback) {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.General,
          userId: isAnonymous === "no" ? currentUser.id : null,
          response: { isAnonymous, experience, comment: feedback } as SurveyFeedbackResponse
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(previousPath)
        } else {
          throw result
        }
      }

      return {
        props: {
          ...props,
          fields: {
            isAnonymous: { hasError: !isAnonymous ? true : false, value: isAnonymous ?? null },
            experience: { hasError: !experience ? true : false, value: experience ?? null },
            feedback: { hasError: !feedback ? true : false, value: feedback }
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
    isAnonymous: {
      hasError: boolean
      value: string
    }
    experience: {
      hasError: boolean
      value: string
    }
    feedback: {
      hasError: boolean
      value: string
    }
  }
}

const FeedbackPage: NextPage<Props> = ({ user, previousPath, fields }: Props) => {
  const [remainingFeedbackLength, setRemainingFeedbackLength] = useState(MAX_FEEDBACK_LENGTH)

  const handleFeedbackOnChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setRemainingFeedbackLength(MAX_FEEDBACK_LENGTH - event.currentTarget.value.length)
  }

  return (
    <>
      <Layout user={user}>
        <Heading as="h2" size="LARGE" aria-label="General Feedback">
          <title>{"Report an issue | Bichard7"}</title>
          <meta name="description" content="user feedback| Bichard7" />
        </Heading>
        <BackLink href={previousPath} onClick={function noRefCheck() {}}>
          {"Back"}
        </BackLink>
        <Heading as="h1">{"How can we help?"}</Heading>
        <Heading as="h2" size="MEDIUM">
          {"Report an issue"}
        </Heading>
        <p className="govuk-body">
          {"If you are encountering specific technical issues, you should either check our "}
          <a className="govuk-link" href="/help">
            {"Help page"}
          </a>{" "}
          {"or "}
          <a className="govuk-link" href="mailto: moj-bichard7@madetech.com">
            {"contact the Bichard7"}
          </a>
          {" for support to raise a ticket. Any issues raised via this page will not be handled."}
        </p>

        <Heading as="h2" size="MEDIUM">
          {"Share your feedback"}
        </Heading>

        <form method="POST" action={"#"}>
          <Paragraph>
            {
              "If you would like to tell us about your experience using the new version of Bichard7, please do so below."
            }
          </Paragraph>
          <Fieldset>
            <FormGroup id="isAnonymous">
              <MultiChoice
                label="After submitting, if we have any enquiries we would like to be able to contact you. If you would like your feedback to be anonymous please opt-out below."
                meta={{
                  error: "Select one of the below options",
                  touched: fields?.isAnonymous.hasError
                }}
              >
                <RadioButton
                  name={"isAnonymous"}
                  id={"isAnonymous-no"}
                  defaultChecked={fields?.isAnonymous.value === "no"}
                  value={"no"}
                  label={"Yes, I am happy to be contacted about this feedback."}
                />
                <RadioButton
                  name={"isAnonymous"}
                  id={"isAnonymous-yes"}
                  defaultChecked={fields?.isAnonymous.value === "yes"}
                  value={"yes"}
                  label={"No, I would like to opt-out, which will mean my feedback will be anonymous."}
                />
              </MultiChoice>
            </FormGroup>

            <FormGroup id="experience">
              <Heading as="h3" size="SMALL">
                {"Rate your experience of using the the new version of Bichard"}
              </Heading>
              <MultiChoice
                label={""}
                meta={{
                  error: "Select one of the below options",
                  touched: fields?.experience.hasError
                }}
              >
                {Object.keys(FeedbackExperienceOptions).map((experienceKey) => (
                  <RadioButton
                    id={experienceKey}
                    defaultChecked={experienceKey === fields?.experience.value}
                    label={FeedbackExperienceOptions[experienceKey as unknown as FeedbackExperienceKey]}
                    key={experienceKey}
                    name={"experience"}
                    value={experienceKey}
                  />
                ))}
              </MultiChoice>
            </FormGroup>

            <FormGroup id="feedback">
              <Heading as="h3" size="SMALL">
                {"Tell us why you gave this rating"}
              </Heading>

              <TextArea
                input={{
                  name: "feedback",
                  defaultValue: fields?.feedback.value,
                  rows: 5,
                  maxLength: MAX_FEEDBACK_LENGTH,
                  onInput: handleFeedbackOnChange
                }}
                meta={{
                  error: "Input message into the text box",
                  touched: fields?.feedback.hasError
                }}
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

export default FeedbackPage
