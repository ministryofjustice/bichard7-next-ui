import If from "components/If"
import { Button, FormGroup, Heading, TextArea } from "govuk-react"

interface Props {
  lockedByAnotherUser: boolean
}

const AddNoteForm: React.FC<Props> = ({ lockedByAnotherUser }: Props) => (
  <>
    <Heading as="h3" size="MEDIUM">
      {"Add Note"}
    </Heading>
    <If condition={lockedByAnotherUser}>{"Case is locked by another user."}</If>
    <If condition={!lockedByAnotherUser}>
      <form method="POST" action="#">
        <FormGroup>
          <TextArea
            input={{
              name: "noteText"
            }}
          >
            {"Note text"}
          </TextArea>
        </FormGroup>

        <Button type="submit">{"Add"}</Button>
      </form>
    </If>
  </>
)

export default AddNoteForm
