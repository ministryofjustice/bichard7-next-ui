import DateTime from "components/DateTime"
import { Table } from "govuk-react"
import { DisplayNote } from "types/display/Notes"

interface Props {
  className?: string
  notes: DisplayNote[]
}

export const NotesTable = ({ notes }: Props) => (
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
        <Table.Cell>{note.userFullName}</Table.Cell>
        <Table.Cell>
          <DateTime date={note.createdAt} />
        </Table.Cell>
        <Table.Cell>{note.noteText}</Table.Cell>
      </Table.Row>
    ))}
  </Table>
)
