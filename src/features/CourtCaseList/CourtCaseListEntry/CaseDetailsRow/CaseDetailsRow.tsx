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
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import {
  filterUserNotes,
  getMostRecentNote
} from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import Note from "services/entities/Note"
import { SingleException } from "./SingleException"
import LockedByTag from "features/CourtCaseList/tags/LockedByTag/LockedByTag"
import CaseUnlockedTag from "features/CourtCaseList/tags/CaseUnlockedTag"
import { LOCKED_ICON_URL } from "features/CourtCaseList/tags/LockedByTag/LockedByText"
import { NotePreview, NotePreviewButton } from "./NotePreviewButton"
import { useCustomStyles } from "../../../../../styles/customStyles"

interface CaseDetailsRowProps {
  canCurrentUserUnlockCase: string | boolean | null | undefined
  hasTriggers: boolean
  courtDate: Date | null
  courtName: string
  defendantName: string | null
  errorId: number
  errorLockedByUsername: string | null | undefined
  errorReport: string
  firstColumnClassName: string
  isCaseUnlocked: boolean
  isResolved: boolean
  isUrgent: boolean
  notes: Note[]
  ptiurn: string
  rowClassName: string
  unlockPath: string
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
  canCurrentUserUnlockCase,
  hasTriggers,
  courtDate,
  courtName,
  defendantName,
  errorId,
  errorLockedByUsername,
  errorReport,
  firstColumnClassName,
  isCaseUnlocked,
  isResolved,
  isUrgent,
  notes,
  ptiurn,
  rowClassName,
  unlockPath
}: CaseDetailsRowProps) => {
  const [showPreview, setShowPreview] = useState(true)

  const { basePath } = useRouter()
  const caseDetailsPath = (id: number) => `${basePath}/court-cases/${id}`

  const exceptions = groupErrorsFromReport(errorReport)
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
          <Link href={caseDetailsPath(errorId)} id={`Case details for ${defendantName}`}>
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
        <Table.Cell className={caseDetailsCellClass}>
          {Object.keys(exceptions).map((exception, exceptionId) => {
            return <SingleException key={exceptionId} exception={exception} exceptionCounter={exceptions[exception]} />
          })}
        </Table.Cell>
        <Table.Cell className={caseDetailsCellClass}>
          {canCurrentUserUnlockCase ? (
            <LockedByTag lockedBy={errorLockedByUsername} unlockPath={unlockPath} />
          ) : (
            <LockedByTag lockedBy={errorLockedByUsername} />
          )}
          {<CaseUnlockedTag isCaseUnlocked={isCaseUnlocked} />}
        </Table.Cell>
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
