import ConditionalRender from "components/ConditionalRender"
import { Button, FormGroup, Heading, TextArea } from "govuk-react"

interface Props {
  lockedByAnotherUser: boolean
  error?: string
}

const AddNoteForm: React.FC<Props> = ({ lockedByAnotherUser, error }: Props) => (
  <>
    <Heading as="h3" size="MEDIUM">
      {"Add a new note"}
    </Heading>
    <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
    <ConditionalRender isRendered={!lockedByAnotherUser}>
      <form method="POST" action="#">
        <FormGroup>
          <TextArea
            input={{
              name: "noteText"
            }}
            meta={{
              error,
              touched: !!error
            }}
          >
            {}
          </TextArea>
          <p>{"You have 2000 characters remaining"}</p>
        </FormGroup>

        <Button id="Add Note" type="submit">
          {"Add"}
        </Button>
      </form>
    </ConditionalRender>
  </>
)

export default AddNoteForm
