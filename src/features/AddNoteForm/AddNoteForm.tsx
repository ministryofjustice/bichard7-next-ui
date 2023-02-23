import If from "components/If"
import { Button, FormGroup, Heading, TextArea } from "govuk-react"

interface Props {
  lockedByAnotherUser: boolean
  error?: string
}

const AddNoteForm: React.FC<Props> = ({ lockedByAnotherUser, error }: Props) => (
  <>
    <Heading as="h2" size="MEDIUM">
      {"Add Note"}
    </Heading>
    <If isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</If>
    <If isRendered={!lockedByAnotherUser}>
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
            {"Note text"}
          </TextArea>
        </FormGroup>

        <Button id="Add Note" type="submit">
          {"Add"}
        </Button>
      </form>
    </If>
  </>
)

export default AddNoteForm
