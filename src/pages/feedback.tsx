import KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import Layout from "components/Layout"
import {
  BackLink,
  Button,
  Fieldset,
  FormGroup,
  Heading,
  HintText,
  MultiChoice,
  Paragraph,
  Radio,
  TextArea
} from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { SurveyFeedbackResponse, SurveyFeedbackType } from "types/SurveyFeedback"
import { isPost } from "utils/http"
import parseFormData from "utils/parseFormData"

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
    // const { previousPath } = query as { previousPath: string }

    const dataSource = await getDataSource()

    const props = {
      user: currentUser.serialize(),
      previousPath: "/bichard",
      displayAnonymousMissingError: false,
      displayExperienceMissingError: false,
      displayfeedbackMissingError: false
    }

    if (isPost(req)) {
      const { isAnonymous, experience, feedback } = (await parseFormData(req)) as {
        isAnonymous: string
        experience: string
        feedback: string
      }

      await insertSurveyFeedback(dataSource, {
        feedbackType: SurveyFeedbackType.General,
        userId: isAnonymous === "no" ? currentUser.id : null,
        response: { isAnonymous, experience, comment: feedback } as SurveyFeedbackResponse
      } as SurveyFeedback)

      return {
        props: {
          ...props,
          displayAnonymousMissingError: !isAnonymous ? true : false,
          displayExperienceMissingError: !experience ? true : false,
          displayfeedbackMissingError: !feedback ? true : false
        }
      }
    }

    //get the request from context
    // Add condition to Check if its a post request
    // - get the form params from the request
    // - persit the feedback using the service we created
    // - redirect to the previous path(we need to find out how to capture the previous path when user is opening feedback page)
    // Ensure to cover this with a cypress test for inserting
    // Make the fields required

    return { props }
  }
)

interface Props {
  user: User
  previousPath: string
  displayAnonymousMissingError: boolean
  displayExperienceMissingError: boolean
  displayfeedbackMissingError: boolean
}

const FeedbackPage: NextPage<Props> = ({
  user,
  previousPath,
  displayAnonymousMissingError,
  displayExperienceMissingError,
  displayfeedbackMissingError
}: Props) => {
  const maxFeedbackNoteLength: number = 2000
  const [noteRemainingLength, setNoteRemainingLength] = useState(maxFeedbackNoteLength)

  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(maxFeedbackNoteLength - event.currentTarget.value.length)
  }
  return (
    <>
      <Layout user={user}>
        <Heading as="h2" size="LARGE" aria-label="General Feedback">
          <title>{"Report an issue | Bichard7"}</title>
          <meta name="description" content="user feedback| Bichard7" />
        </Heading>
        <BackLink href={previousPath} onClick={function noRefCheck() { }}>
          {"Back"}
        </BackLink>
        <Heading as="h1">{"How can we help?"}</Heading>
        <Heading as="h2" size="MEDIUM">
          {"Report an issue"}
        </Heading>

        <Paragraph>
          {
            "If you are encountering specific technical issues, you should either check our [Help page](#) or [contact the Bichard7](#) for support to raise a ticket. Any issues raised via this page will not be handled"
          }
        </Paragraph>

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
            <FormGroup>
              <MultiChoice
                label="After submitting, if we have any enquiries we would like to be able to contact you. If you would like your feedback to be anonymous please opt-out below."
                meta={{
                  error: "Select one of the below options",
                  touched: displayAnonymousMissingError
                }}
              >
                <Radio name="isAnonymous" value={"no"}>
                  {"Yes, I would like to be contacted about this feedback."}
                </Radio>

                <Radio name="isAnonymous" value={"yes"}>
                  {"No, I would like to opt-out, which will mean my feedback will be anonymous."}
                </Radio>
              </MultiChoice>
            </FormGroup>

            <FormGroup>
              <Heading as="h3" size="SMALL">
                {"Rate your experience of using the the new version of Bichard"}
              </Heading>
              <MultiChoice
                label={""} // TODO: Check if this works in test
                meta={{
                  error: "Select one of the below options",
                  touched: displayExperienceMissingError
                }}
              >
                {Object.keys(FeedbackExperienceOptions).map((experienceKey) => (
                  <Radio key={experienceKey} name={"experience"} value={experienceKey}>
                    {FeedbackExperienceOptions[experienceKey as unknown as FeedbackExperienceKey]}
                  </Radio>
                ))}
              </MultiChoice>
            </FormGroup>

            <FormGroup>
              <Heading as="h3" size="SMALL">
                {"Tell us why you gave this rating"}
              </Heading>

              <TextArea
                input={{ name: "feedback", rows: 5, maxLength: maxFeedbackNoteLength, onInput: handleOnNoteChange }}
                meta={{
                  error: "Input message into the text box",
                  touched: displayfeedbackMissingError
                }}
              >
                { }
              </TextArea>

              <HintText>{`You have ${noteRemainingLength} characters remaining`}</HintText>
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
