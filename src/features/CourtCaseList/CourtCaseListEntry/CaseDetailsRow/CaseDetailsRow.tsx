import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import {
  filterUserNotes,
  getMostRecentNote
} from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import ResolutionStatusBadge from "features/CourtCaseList/tags/ResolutionStatusBadge"
import UrgentTag from "features/CourtCaseList/tags/UrgentTag"
import { Link, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import { DisplayNote } from "types/display/Notes"
import { displayedDateFormat } from "utils/formattedDate"
import { LOCKED_ICON_URL } from "utils/icons"
import { useCustomStyles } from "../../../../../styles/customStyles"
import { NotePreview, NotePreviewButton } from "./NotePreviewButton"
import { ResolutionStatus } from "../../../../types/ResolutionStatus"

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
  resolutionStatus: ResolutionStatus
  isUrgent: boolean
  notes: DisplayNote[]
  ptiurn: string
  rowClassName: string
  unlockPath: string
  reasonCell: JSX.Element
  lockTag: JSX.Element
  previousPath: string | null
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
  resolutionStatus,
  isUrgent,
  notes,
  ptiurn,
  rowClassName,
  reasonCell,
  lockTag,
  previousPath
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

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <Table.Row className={`${classes.caseDetailsRow} ${rowClassName}`}>
        <Table.Cell className={`${caseDetailsCellClass} ${firstColumnClassName}`}>
          <ConditionalRender isRendered={!!errorLockedByUsername}>
            <Image src={LOCKED_ICON_URL} priority width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>
          <Link href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`}>
            {defendantName}
            <br />
            <ResolutionStatusBadge resolutionStatus={resolutionStatus} />
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
