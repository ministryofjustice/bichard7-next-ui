import Layout from "components/Layout"
import { BackLink, Button, Fieldset, FormGroup, Heading, HintText, Paragraph, Radio, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import User from "services/entities/User"
// import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req } = context as AuthenticationServerSidePropsContext
    // const { previousPath } = query as { previousPath: string | null }
    // const dataSource = await getDataSource()

    const props = {
      user: currentUser.serialize(),
      previousPath: "/bichard"
    }

    //get the request from context
    // Add condition to Check if its a post request
    // - get the form params from the request
    // - persit the feedback using the service we created
    // - redirect to the previous path(we need to find out how to capture the previous path when user is opening feedback page)
    // Ensure to cover this with a cypress test

    return { props }
  }
)

interface Props {
  user: User
  previousPath: string
}

const FeedbackPage: NextPage<Props> = ({ user, previousPath }: Props) => {
  const maxFeedbackNoteLength: number = 2000
  const [noteRemainingLength, setNoteRemainingLength] = useState(maxFeedbackNoteLength)
  const noteIsEmpty = noteRemainingLength === maxFeedbackNoteLength
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
            "If you are encountering specific technical issues, you should either check our [FAQ page](#) or [contact the Bichard7](#) for support to raise a ticket. Any issues raised via this page will not be handled"
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
              <Paragraph>
                {
                  "After submitting, if we have any enquiries we would like to be able to contact you. If you would like your feedback to be anonymous please opt-out below."
                }
              </Paragraph>

              <Radio name="anonymous" value={"yes"}>
                {"Yes, I would like to be contacted about this feedback."}
              </Radio>

              <Radio name="anonymous" value={"no"}>
                {"No, I would like to opt-out, which will mean my feedback will be anonymous."}
              </Radio>
            </FormGroup>

            <FormGroup>
              <Heading as="h3" size="SMALL">
                {"Rate your experience of using the the new version of Bichard"}
              </Heading>
              <Paragraph>{"Select one of the below options."}</Paragraph>
              <Radio name={"Rate your experience"}>{"Very satisfied"}</Radio>
              <Radio name={"Rate your experience"}>{"Satisfied"}</Radio>
              <Radio name={"Rate your experience"}>{"Neither satisfied nor dissatisfied"}</Radio>
              <Radio name={"Rate your experience"}>{"Dissatisfied"}</Radio>
              <Radio name={"Rate your experience"}>{"Very dissatisfied"}</Radio>
            </FormGroup>

            <FormGroup>
              <Heading as="h3" size="SMALL">
                {"Tell us why you gave this rating"}
              </Heading>

              <TextArea
                input={{ name: "feedback", rows: 5, maxLength: maxFeedbackNoteLength, onInput: handleOnNoteChange }}
                meta={{
                  error: "Input message into the text box",
                  touched: noteIsEmpty
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
