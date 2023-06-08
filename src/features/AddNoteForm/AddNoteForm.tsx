import ConditionalRender from "components/ConditionalRender"
import { MAX_NOTE_LENGTH } from "config"
import { Button, FormGroup, Heading, HintText, TextArea } from "govuk-react"
import { FormEvent, FormEventHandler, useState } from "react"

interface Props {
  lockedByAnotherUser: boolean
  error?: string
}

const AddNoteForm: React.FC<Props> = ({ lockedByAnotherUser, error }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const [showError, setShowError] = useState(false)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    if (noteRemainingLength === MAX_NOTE_LENGTH) {
      setShowError(true)
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
          <FormGroup error={showError && noteRemainingLength === MAX_NOTE_LENGTH}>
            <Heading as="h3" size="MEDIUM">
              {"Add a new note"}
            </Heading>
            <TextArea
              input={{ name: "noteText", rows: 5, maxLength: MAX_NOTE_LENGTH, onInput: handleOnNoteChange }}
              meta={{
                error,
                touched: !!error
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
