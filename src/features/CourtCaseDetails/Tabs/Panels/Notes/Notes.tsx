import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import LinkButton from "components/LinkButton"
import { Paragraph, Table } from "govuk-react"
import Note from "services/entities/Note"
import { CourtCaseDetailsPanel } from "../../CourtCaseDetailsPanels"

interface NotesProps {
  notes: Note[]
  lockedByAnotherUser: boolean
}

export const Notes = ({ notes, lockedByAnotherUser }: NotesProps) => {
  return (
    <CourtCaseDetailsPanel heading={"Notes"}>
      <ConditionalRender isRendered={(notes.length ?? 0) > 0}>
        <Table
          head={
            <Table.Row>
              <Table.CellHeader>{"User"}</Table.CellHeader>
              <Table.CellHeader>{"Time"}</Table.CellHeader>
              <Table.CellHeader>{"Note"}</Table.CellHeader>
            </Table.Row>
          }
        >
          {notes.map((note, index) => (
            <Table.Row key={index}>
              <Table.Cell>{note.userId}</Table.Cell>
              <Table.Cell>
                <DateTime date={note.createdAt} />
              </Table.Cell>
              <Table.Cell>{note.noteText}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </ConditionalRender>
      <ConditionalRender isRendered={(notes.length ?? 0) === 0}>
        <Paragraph>{"Case has no notes."}</Paragraph>
      </ConditionalRender>
      <ConditionalRender isRendered={!lockedByAnotherUser}>
        <LinkButton href="notes/add">{"Add Note"}</LinkButton>
      </ConditionalRender>
    </CourtCaseDetailsPanel>
  )
}
