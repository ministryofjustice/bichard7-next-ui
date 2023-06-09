import ConditionalRender from "components/ConditionalRender"
import { MAX_NOTE_LENGTH } from "config"
import { Button, FormGroup, HintText, Label, TextArea } from "govuk-react"
import { FormEvent, FormEventHandler, useState } from "react"

interface Props {
  lockedByAnotherUser: boolean
}

const AddNoteForm: React.FC<Props> = ({ lockedByAnotherUser }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const [isFormValid, setIsFormValid] = useState(true)
  const showError = !isFormValid && noteRemainingLength === MAX_NOTE_LENGTH

  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    if (noteRemainingLength === MAX_NOTE_LENGTH) {
      setIsFormValid(false)
      event.preventDefault()
      return false
    }
    return true
  }
  return (
    <>
      <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
      <ConditionalRender isRendered={!lockedByAnotherUser}>
        <form method="POST" action="#" onSubmit={validateForm}>
          <FormGroup>
            <Label className="govuk-heading-m b7-form-label-lg" htmlFor="noteText">
              {"Add a new note"}
            </Label>
            <TextArea
              input={{ name: "noteText", rows: 5, maxLength: MAX_NOTE_LENGTH, onInput: handleOnNoteChange }}
              meta={{
                error: "Input message into text box",
                touched: showError
              }}
            >
              {}
            </TextArea>
            <HintText>{`You have ${noteRemainingLength} characters remaining`}</HintText>
          </FormGroup>

          <Button id="Add Note" type="submit">
            {"Add note"}
          </Button>
        </form>
      </ConditionalRender>
    </>
  )
}

export default AddNoteForm
