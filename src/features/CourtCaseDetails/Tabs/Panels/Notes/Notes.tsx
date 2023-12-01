import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import NotesFilterOptions from "components/NotesFilterOptions"
import { useCourtCase } from "context/CourtCaseContext"
import { Paragraph, Table } from "govuk-react"
import { useState } from "react"
import type NotesViewOption from "types/NotesViewOption"
import { DisplayNote } from "types/display/Notes"
import { CourtCaseDetailsPanel } from "../../CourtCaseDetailsPanels"
import AddNoteForm from "./AddNoteForm"

interface NotesProps {
  className: string
  isLockedByCurrentUser: boolean
}

const filterNotes = (notes: DisplayNote[], viewOption?: NotesViewOption) => {
  let noNoteText = "notes"
  let filteredNotes: DisplayNote[] = []
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

export const Notes = ({ className, isLockedByCurrentUser }: NotesProps) => {
  const courtCase = useCourtCase()
  const notes: DisplayNote[] = courtCase.notes

  const [viewOption, setViewOption] = useState<NotesViewOption | undefined>()
  const [filteredNotes, noNoteText] = filterNotes(notes, viewOption)
  const hasNotes = notes.length > 0
  const hasFilteredNotes = filteredNotes.length > 0

  return (
    <CourtCaseDetailsPanel className={className} heading={"Notes"}>
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
      <AddNoteForm isLockedByCurrentUser={isLockedByCurrentUser} />
    </CourtCaseDetailsPanel>
  )
}
