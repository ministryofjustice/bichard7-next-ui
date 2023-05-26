import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import LinkButton from "components/LinkButton"
import { Paragraph, Table } from "govuk-react"
import Note from "services/entities/Note"
import { CourtCaseDetailsPanel } from "../../CourtCaseDetailsPanels"
import NotesFilterOptions from "components/NotesFilterOptions"
import { useState } from "react"
import type NotesViewOption from "types/NotesViewOption"

interface NotesProps {
  notes: Note[]
  lockedByAnotherUser: boolean
}

const filterNotes = (notes: Note[], viewOption?: NotesViewOption) => {
  let noNoteText = "notes"
  let filteredNotes: Note[] = []
  switch (viewOption) {
    case "View system notes":
      noNoteText = "system notes"
      filteredNotes = notes.filter(({ userId }) => userId === "System")
      break
    case "View user notes":
      noNoteText = "user notes"
      filteredNotes = notes.filter(({ userId }) => userId !== "System")
      break
    default:
      filteredNotes = notes
      break
  }

  return [filteredNotes, noNoteText] as const
}

export const Notes = ({ notes, lockedByAnotherUser }: NotesProps) => {
  const [viewOption, setViewOption] = useState<NotesViewOption | undefined>()
  const [filteredNotes, noNoteText] = filterNotes(notes, viewOption)
  const hasNotes = notes.length > 0
  const hasFilteredNotes = filteredNotes.length > 0

  return (
    <CourtCaseDetailsPanel heading={"Notes"}>
      <NotesFilterOptions dispatch={setViewOption} selectedOption={viewOption} />
      <ConditionalRender isRendered={hasNotes}>
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
              <Table.Cell>{note.userId}</Table.Cell>
              <Table.Cell>
                <DateTime date={note.createdAt} />
              </Table.Cell>
              <Table.Cell>{note.noteText}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </ConditionalRender>
      <ConditionalRender isRendered={!hasFilteredNotes}>
        <Paragraph>{`Case has no ${noNoteText}.`}</Paragraph>
      </ConditionalRender>
      <ConditionalRender isRendered={!lockedByAnotherUser}>
        <LinkButton href="notes/add">{"Add Note"}</LinkButton>
      </ConditionalRender>
    </CourtCaseDetailsPanel>
  )
}
