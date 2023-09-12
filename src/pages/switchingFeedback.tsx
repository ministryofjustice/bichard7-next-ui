import Layout from "components/Layout"
import RadioButton from "components/RadioButton/RadioButton"
import { MAX_FEEDBACK_LENGTH } from "config"
import { BackLink, Button, Fieldset, FormGroup, Heading, HintText, MultiChoice, SkipLink, TextArea } from "govuk-react"
import { NextPage } from "next"
import { FormEventHandler, useState } from "react"
import User from "services/entities/User"

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
        <BackLink href={previousPath} onClick={function noRefCheck() { }}>
          {"Back"}
        </BackLink>
        <SkipLink href="" onClick={function noRefCheck() { }}>
          {" "}
          {"Skip feedback"}
        </SkipLink>{" "}
        {/* Todo: Add old Bichard link*/}
        <Heading as="h1">{"Share your feedback"}</Heading>
        <p className="govuk-body">
          {
            "You have selected to revert back to old bichard. What was the reason for doing so can you please select the appropriate option and outline the problem that occurred below so that we can best understand."
          }
        </p>
        <form method="POST" action={"#"}>
          <Fieldset>
            <FormGroup id="issueOrPreference">
              <Heading as="h3" size="SMALL">
                {"Why have you decided to switch version of bichard?"}
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
                    "I have found an issue(s) when using the new version of bichard which is blocking me from completing my task."
                  }
                />
                <RadioButton
                  name={"issueOrPreference"}
                  id={"issueOrPreference-preference"}
                  defaultChecked={fields?.issueOrPreference.value === "preference"}
                  value={"preference"}
                  label={"I prefer working in the old version and dislike working in the new version."}
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
            <FormGroup id="componentIssue">
              <Heading as="h3" size="SMALL">
                {"Could you select one of the options below and explain what problem you have experienced?"}
              </Heading>
              <MultiChoice
                label={""}
                meta={{
                  error: "Select one of the below options",
                  touched: fields?.componentIssue.hasError
                }}
              >
                <RadioButton
                  name={"componentIssue"}
                  id={"componentIssue-searchAndFilterPanel"}
                  defaultChecked={fields?.componentIssue.value === "searchAndFilterPanel"}
                  value={"searchAndFilterPanel"}
                  label={"Search and filter panel"}
                />
                <RadioButton
                  name={"componentIssue"}
                  id={"componentIssue-pagePagination"}
                  defaultChecked={fields?.componentIssue.value === "pagePagination"}
                  value={"pagePagination"}
                  label={"Page pagination"}
                />
                <RadioButton
                  name={"componentIssue"}
                  id={"componentIssue-columnHeaders"}
                  defaultChecked={fields?.componentIssue.value === "columnHeaders"}
                  value={"columnHeaders"}
                  label={"Table column headers"}
                />
                <RadioButton
                  name={"componentIssue"}
                  id={"componentIssue-notesPreview"}
                  defaultChecked={fields?.componentIssue.value === "notesPreview"}
                  value={"notesPreview"}
                  label={"Notes preview"}
                />
                <RadioButton
                  name={"componentIssue"}
                  id={"componentIssue-removingHandlers"}
                  defaultChecked={fields?.componentIssue.value === "removingHandlers"}
                  value={"removingHandlers"}
                  label={"Removing handlers from case"}
                />
                <RadioButton
                  name={"componentIssue"}
                  id={"componentIssue-other"}
                  defaultChecked={fields?.componentIssue.value === "other"}
                  value={"other"}
                  label={"Other (please specify)"}
                />
              </MultiChoice>
            </FormGroup>
            <FormGroup id="otherFeedback">
              <Heading as="h3" size="SMALL">
                {"Tell us why you have made this selection."}
              </Heading>
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
