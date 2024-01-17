import DateTime from "components/DateTime"
import { useCourtCase } from "context/CourtCaseContext"
import { Heading, Table } from "govuk-react"
import { DisplayNote } from "types/display/Notes"

interface Props {
  className?: string
}

export const UserNotes = ({ className }: Props) => {
  const courtCase = useCourtCase()
  const notes: DisplayNote[] = courtCase.notes

  const filteredNotes = notes.filter(({ userId }) => userId !== "System")

  return (
    <div className={className}>
      <Heading as="h2" size="SMALL">
        {"Previous User Notes"}
      </Heading>
      <Table
        head={
          <Table.Row>
            <Table.CellHeader>{"User"}</Table.CellHeader>
            <Table.CellHeader>{"Time"}</Table.CellHeader>
            <Table.CellHeader>{"Note"}</Table.CellHeader>
          </Table.Row>
        }
      >
        {filteredNotes.map((note, index) => (
          <Table.Row key={index}>
            <Table.Cell>{note.userFullName}</Table.Cell>
            <Table.Cell>
              <DateTime date={note.createdAt} />
            </Table.Cell>
            <Table.Cell>{note.noteText}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  )
}
