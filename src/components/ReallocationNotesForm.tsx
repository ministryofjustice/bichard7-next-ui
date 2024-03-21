import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import { MAX_NOTE_LENGTH } from "config"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { Button, Fieldset, FormGroup, HintText, Label, LabelText, Link, Select, TextArea } from "govuk-react"
import { FormEventHandler, useState } from "react"
import getForcesForReallocation from "services/getForcesForReallocation"
import { useCustomStyles } from "../../styles/customStyles"
import ButtonsGroup from "./ButtonsGroup"
import Form from "./Form"

interface Props {
  backLink: string
}

const ReallocationNotesForm = ({ backLink }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const classes = useCustomStyles()
  const { courtCase } = useCourtCase()
  const currentForce = forces.find((force) => force.code === courtCase.orgForPoliceFilter?.substring(0, 2))
  const forcesForReallocation = getForcesForReallocation(currentForce?.code)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  const csrfToken = useCsrfToken()

  return (
    <Form method="POST" action="#" csrfToken={csrfToken || ""}>
      <Fieldset>
        <FormGroup>
          <Label>
            <LabelText className="govuk-!-font-weight-bold">{"Current force owner"}</LabelText>
          </Label>
          <span className="govuk-body-m">{`${currentForce?.code} - ${currentForce?.name}`}</span>
        </FormGroup>
        <FormGroup>
          <Label>
            <LabelText className="govuk-!-font-weight-bold">{"New force owner"}</LabelText>
          </Label>
          <Select input={{ name: "force" }} label={""}>
            {forcesForReallocation.map(({ code, name }) => (
              <option key={code} value={code}>
                {`${code} - ${name}`}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label className="govuk-heading-s">{"Add a note (optional)"}</Label>
          <HintText className={classes["no-margin-bottom"]}>{"Input reason for case reallocation"}</HintText>
          <TextArea input={{ name: "note", rows: 5, maxLength: MAX_NOTE_LENGTH, onInput: handleOnNoteChange }}>
            {""}
          </TextArea>
          <HintText>{`You have ${noteRemainingLength} characters remaining`}</HintText>
        </FormGroup>

        <ButtonsGroup>
          <Button id="Reallocate" type="submit">
            {"Reallocate Case"}
          </Button>
          <Link href={backLink}>{"Cancel"}</Link>
        </ButtonsGroup>
      </Fieldset>
    </Form>
  )
}

export default ReallocationNotesForm
