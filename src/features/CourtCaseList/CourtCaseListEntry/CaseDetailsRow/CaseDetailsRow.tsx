import ConditionalRender from "components/ConditionalRender"
import { Link, Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Image from "next/image"
import { useRouter } from "next/router"
import ResolvedTag from "features/CourtCaseList/tags/ResolvedTag"
import DateTime from "components/DateTime"
import { displayedDateFormat } from "utils/formattedDate"
import UrgentTag from "features/CourtCaseList/tags/UrgentTag"
import { NotePreview, NotePreviewButton } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/NotePreviewButton"
import { useState } from "react"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { filterUserNotes, getMostRecentNote } from "features/CourtCaseList/CourtCaseListEntryHelperFunction"
import Note from "services/entities/Note"
import { SingleException } from "./SingleException"
import LockedByTag from "features/CourtCaseList/tags/LockedByTag/LockedByTag"
import CaseUnlockedTag from "features/CourtCaseList/tags/CaseUnlockedTag"

interface CaseDetailsRowProps {
  canCurrentUserUnlockCase: string | boolean | null | undefined
  courtDate: Date | null
  courtName: string
  defendantName: string | null
  errorId: number
  errorLockedByUsername: string | null | undefined
  errorReport: string
  isCaseUnlocked: boolean
  isResolved: boolean
  isUrgent: boolean
  notes: Note[]
  ptiurn: string
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
  courtDate,
  courtName,
  defendantName,
  errorId,
  errorLockedByUsername,
  errorReport,
  isCaseUnlocked,
  isResolved,
  isUrgent,
  notes,
  ptiurn,
  unlockPath
}: CaseDetailsRowProps) => {
  const [showPreview, setShowPreview] = useState(false)

  const { basePath } = useRouter()
  const caseDetailsPath = (id: number) => `${basePath}/court-cases/${id}`

  const exceptions = groupErrorsFromReport(errorReport)
  const userNotes = filterUserNotes(notes)
  const mostRecentUserNote = getMostRecentNote(userNotes)
  const numberOfNotes = userNotes.length

  const classes = useStyles()

  return (
    <>
      <Table.Row className={classes.caseDetailsRow}>
        <Table.Cell>
          <ConditionalRender isRendered={!!errorLockedByUsername}>
            <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </Table.Cell>
        <Table.Cell>
          <Link href={caseDetailsPath(errorId)} id={`Case details for ${defendantName}`}>
            {defendantName}
            <br />
            <ResolvedTag isResolved={isResolved} />
          </Link>
        </Table.Cell>
        <Table.Cell>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </Table.Cell>
        <Table.Cell>{courtName}</Table.Cell>
        <Table.Cell>{ptiurn}</Table.Cell>
        <Table.Cell>
          <UrgentTag isUrgent={isUrgent} />
        </Table.Cell>
        <Table.Cell>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </Table.Cell>
        <Table.Cell>
          {Object.keys(exceptions).map((exception, exceptionId) => {
            return <SingleException key={exceptionId} exception={exception} exceptionCounter={exceptions[exception]} />
          })}
        </Table.Cell>
        <Table.Cell>
          {canCurrentUserUnlockCase ? (
            <LockedByTag lockedBy={errorLockedByUsername} unlockPath={unlockPath} />
          ) : (
            <LockedByTag lockedBy={errorLockedByUsername} />
          )}
          {<CaseUnlockedTag isCaseUnlocked={isCaseUnlocked} />}
        </Table.Cell>
      </Table.Row>
      {numberOfNotes != 0 && !!showPreview && (
        <Table.Row className={classes.notesRow}>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }} colSpan={2}>
            <NotePreview latestNote={mostRecentUserNote} numberOfNotes={numberOfNotes} />
          </Table.Cell>
          <Table.Cell />
        </Table.Row>
      )}
    </>
  )
}
