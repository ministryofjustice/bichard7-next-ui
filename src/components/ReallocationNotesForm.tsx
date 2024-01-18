import { MAX_NOTE_LENGTH } from "config"
import { Fieldset, FormGroup, Label, Select, HintText, TextArea, Button, Link } from "govuk-react"
import ButtonsGroup from "./ButtonsGroup"
import Form from "./Form"
import { useCustomStyles } from "../../styles/customStyles"
import { FormEventHandler, useState } from "react"
import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import getForcesForReallocation from "services/getForcesForReallocation"
import { DisplayFullCourtCase } from "types/display/CourtCases"

interface Props {
  courtCase: DisplayFullCourtCase
  csrfToken: string
  backLink: string
}

const ReallocationNotesForm = ({ courtCase, csrfToken, backLink }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const classes = useCustomStyles()
  const currentForce = forces.find((force) => force.code === courtCase.orgForPoliceFilter?.substring(0, 2))
  const forcesForReallocation = getForcesForReallocation(currentForce?.code)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  return (
    <Form method="POST" action="#" csrfToken={csrfToken}>
      <Fieldset>
        <FormGroup>
          <Label className="govuk-heading-s">{"Current force owner"}</Label>
          <span className="govuk-body-m">{`${currentForce?.code} - ${currentForce?.name}`}</span>
        </FormGroup>
        <FormGroup>
          <Label className="govuk-heading-s">{"New force owner"}</Label>
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
            {"Reallocate"}
          </Button>
          <Link href={backLink}>{"Cancel"}</Link>
        </ButtonsGroup>
      </Fieldset>
    </Form>
  )
}

export default ReallocationNotesForm
