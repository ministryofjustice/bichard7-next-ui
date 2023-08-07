import ConditionalRender from "components/ConditionalRender"
import { Link, Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Image from "next/image"
import { useRouter } from "next/router"
import ResolvedTag from "features/CourtCaseList/tags/ResolvedTag"
import DateTime from "components/DateTime"
import { displayedDateFormat } from "utils/formattedDate"
import UrgentTag from "features/CourtCaseList/tags/UrgentTag"
import { useState } from "react"
import {
  filterUserNotes,
  getMostRecentNote
} from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import Note from "services/entities/Note"
import { NotePreview, NotePreviewButton } from "./NotePreviewButton"
import { useCustomStyles } from "../../../../../styles/customStyles"
import { LOCKED_ICON_URL } from "utils/icons"

interface CaseDetailsRowProps {
  canCurrentUserUnlockCase: string | boolean | null | undefined
  hasTriggers: boolean
  courtDate: Date | null
  courtName: string
  defendantName: string | null
  errorId: number
  errorLockedByUsername: string | null | undefined
  errorLockedByUserFullName: string | null | undefined
  errorReport: string
  firstColumnClassName: string
  isCaseUnlocked: boolean
  isResolved: boolean
  isUrgent: boolean
  notes: Note[]
  ptiurn: string
  rowClassName: string
  unlockPath: string
  reasonCell: JSX.Element
  lockTag: JSX.Element
}

const useStyles = createUseStyles({
  caseDetailsRow: {
    verticalAlign: "top",
    borderColor: "unset"
  },
  flexBox: {
    display: "flex"
  },
  notesRow: {
    borderTop: "white solid"
  }
})

export const CaseDetailsRow = ({
  hasTriggers,
  courtDate,
  courtName,
  defendantName,
  errorId,
  errorLockedByUsername,
  firstColumnClassName,
  isResolved,
  isUrgent,
  notes,
  ptiurn,
  rowClassName,
  reasonCell,
  lockTag
}: CaseDetailsRowProps) => {
  const [showPreview, setShowPreview] = useState(true)
  const { basePath } = useRouter()
  const userNotes = filterUserNotes(notes)
  const mostRecentUserNote = getMostRecentNote(userNotes)
  const numberOfNotes = userNotes.length

  const classes = useStyles()
  const customClasses = useCustomStyles()

  const caseDetailsCellClass = !hasTriggers && showPreview ? "" : customClasses["border-bottom-none"]
  const notePreviewCellClass = !hasTriggers && !showPreview ? "" : customClasses["border-bottom-none"]

  return (
    <>
      <Table.Row className={`${classes.caseDetailsRow} ${rowClassName}`}>
        <Table.Cell className={`${caseDetailsCellClass} ${firstColumnClassName}`}>
          <ConditionalRender isRendered={!!errorLockedByUsername}>
            <Image src={LOCKED_ICON_URL} width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>
          <Link href={`${basePath}/court-cases/${errorId}`}>
            {defendantName}
            <br />
            <ResolvedTag isResolved={isResolved} />
          </Link>
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>{courtName}</Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>{ptiurn}</Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>
          <UrgentTag isUrgent={isUrgent} />
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>{reasonCell}</Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>{lockTag}</Table.Cell>
      </Table.Row>
      {numberOfNotes != 0 && !showPreview && (
        <Table.Row className={`${rowClassName}`}>
          <Table.Cell
            className={`${notePreviewCellClass} ${firstColumnClassName} ${customClasses["top-padding-none"]}`}
          ></Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`}></Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`}></Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`}></Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`}></Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`}></Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`} colSpan={2}>
            <NotePreview latestNote={mostRecentUserNote} numberOfNotes={numberOfNotes} />
          </Table.Cell>
          <Table.Cell className={`${notePreviewCellClass} ${customClasses["top-padding-none"]}`} />
        </Table.Row>
      )}
    </>
  )
}
