import ConditionalRender from "components/ConditionalRender"
import { Button, FormGroup, Heading, HintText, TextArea } from "govuk-react"
import { FormEventHandler, useState } from "react"

interface Props {
  lockedByAnotherUser: boolean
  error?: string
}

const MAX_NOTE_LENGTH = 1000

const AddNoteForm: React.FC<Props> = ({ lockedByAnotherUser, error }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }
  return (
    <>
      <Heading as="h3" size="MEDIUM">
        {"Add a new note"}
      </Heading>
      <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
      <ConditionalRender isRendered={!lockedByAnotherUser}>
        <form method="POST" action="#">
          <FormGroup>
            <TextArea
              input={{ name: "note", rows: 5, maxLength: MAX_NOTE_LENGTH, onInput: handleOnNoteChange }}
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
