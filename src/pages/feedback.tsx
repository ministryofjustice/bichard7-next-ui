import Layout from "components/Layout"
import { MAX_NOTE_LENGTH } from "config"
import { Fieldset, FormGroup, Heading, HintText, Label, Select, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import User from "services/entities/User"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { useCustomStyles } from "../../styles/customStyles"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const props = {
      user: currentUser.serialize()
    }

    return { props }
  }
)

interface Props {
  user: User
}

const FeedbackPage: NextPage<Props> = ({ user }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH) // TODO: change max feedback length to 2000 characters
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }
  const classes = useCustomStyles()
  return (
    <>
      <Layout user={user}>
        <Heading as="h2" size="LARGE" aria-label="General Feedback">
          <title>{"Report an issue | Bichard7"}</title>
          <meta name="description" content="user feedback| Bichard7" />
        </Heading>
        <h1>{"How can we help?"}</h1>
        <Heading as="h2" size="MEDIUM">
          {"Report an issue"}
        </Heading>
        <p>
          {
            "If you are encountering specific technical issues, you should either check our FAQ page or contact the Bichard7 team for support. to raise a ticket. Any issues raised via this page will not be handled."
          }
        </p>
        <Heading as="h2" size="MEDIUM">
          {"Share your feedback"}
        </Heading>
        <p>
          {"If you would like to tell us about your experience using the new version of Bichard7, please do so below."}
        </p>
        <p>
          {
            "After submitting, if we have any enquiries we would like to be able to contact you. If you would like your feedback to be anonymous please opt-out below."
          }
        </p>
        <form method="POST" action={"#"}>
          <Fieldset>
            {" "}
            <FormGroup>
              <Label>{"Rate your experience of using the the new version of Bichard"}</Label>
              <Select label={""}>
                {" "}
                <option value=""></option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>{"Tell us why you gave this rating"}</Label>
              <HintText className={classes["no-margin-bottom"]}>{"Input message into the text box"}</HintText>
              <TextArea input={{ name: "feedback", rows: 5, maxLength: MAX_NOTE_LENGTH, onInput: handleOnNoteChange }}>
                { }
              </TextArea>
              <HintText>{`You have ${noteRemainingLength} characters remaining`}</HintText>
            </FormGroup>
          </Fieldset>
        </form>
      </Layout>
    </>
  )
}

export default FeedbackPage
