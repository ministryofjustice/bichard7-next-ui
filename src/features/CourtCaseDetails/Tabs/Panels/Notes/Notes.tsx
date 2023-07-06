import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import NotesFilterOptions from "components/NotesFilterOptions"
import AddNoteForm from "./AddNoteForm"
import { Paragraph, Table } from "govuk-react"
import { useState } from "react"
import Note from "services/entities/Note"
import type NotesViewOption from "types/NotesViewOption"
import { CourtCaseDetailsPanel } from "../../CourtCaseDetailsPanels"

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
              <Table.Cell>{note.userFullName}</Table.Cell>
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
      <AddNoteForm lockedByAnotherUser={lockedByAnotherUser} />
    </CourtCaseDetailsPanel>
  )
}
