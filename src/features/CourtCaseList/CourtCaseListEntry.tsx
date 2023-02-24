import DateTime from "components/DateTime"
import If from "components/If"
import { format } from "date-fns"
import { GridRow, Link, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { displayedDateFormat } from "utils/formattedDate"
import LockedByTag from "./tags/LockedByTag"
import NotePreviewButton, { NotePreview } from "./tags/NotePreviewButton"
import UrgentTag from "./tags/UrgentTag"

const useStyles = createUseStyles({
  caseDetailsRow: {
    verticalAlign: "top",
    borderColor: "unset"
  },
  triggersRow: {
    verticalAlign: "top",
    backgroundColor: "#f3f2f1" // GDS light-grey color
  },
  flexBox: {
    display: "flex"
  },
  notesRow: {
    borderTop: "white solid"
  }
})

interface Props {
  courtCase: CourtCase
  currentUser: User
}
const CourtCaseListEntry: React.FC<Props> = ({ courtCase, currentUser }: Props) => {
  const {
    errorId,
    courtDate,
    ptiurn,
    defendantName,
    courtName,
    triggers,
    errorReport,
    isUrgent,
    errorLockedByUsername,
    triggerLockedByUsername,
    notes
  } = courtCase
  const classes = useStyles()
  const { basePath, query } = useRouter()

  let searchParams = new URLSearchParams(encode(query))
  searchParams = deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)
  const caseDetailsPath = (id: number) => `${basePath}/court-cases/${id}`
  const unlockCaseWithReasonPath = (reason: "Trigger" | "Exception", caseId: string) => {
    searchParams.append(`unlock${reason}`, caseId)
    return `${basePath}/?${searchParams}`
  }
  const canUnlockCase = (lockedUsername: string): boolean => {
    return currentUser.groups.includes("Supervisor") || currentUser.username === lockedUsername
  }

  const exceptions = groupErrorsFromReport(errorReport)

  const [showPreview, setShowPreview] = useState(false)
  const createdAtDatesForAllNotes = notes.map((note) => note.createdAt)
  const mostRecentNoteDate = createdAtDatesForAllNotes.sort().slice(-1)[0]
  const mostRecentNote = notes.filter((note) => note.createdAt === mostRecentNoteDate)
  const validatedMostRecentNoteDate = new Date(mostRecentNoteDate.toString().slice(0, 10))
  const mostRecentNoteText = mostRecentNote[0].noteText
  const first100CharsOfMostRecentNote =
    mostRecentNoteText.length > 100 ? `${mostRecentNoteText.slice(0, 101)}...` : mostRecentNoteText

  const triggerRow =
    triggers.length > 0 ? (
      <Table.Row className={classes.triggersRow}>
        <Table.Cell>
          <If condition={!!triggerLockedByUsername}>
            <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
          </If>
        </Table.Cell>
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell>
          {triggers?.map((trigger, triggerId) => (
            <GridRow key={`trigger_${triggerId}`}>{getTriggerWithDescription(trigger.triggerCode)}</GridRow>
          ))}
        </Table.Cell>
        <Table.Cell>
          {triggerLockedByUsername && canUnlockCase(triggerLockedByUsername) ? (
            <LockedByTag
              lockedBy={triggerLockedByUsername}
              unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
            />
          ) : (
            <LockedByTag lockedBy={triggerLockedByUsername} />
          )}
        </Table.Cell>
      </Table.Row>
    ) : (
      <></>
    )

  return (
    <>
      <Table.Row className={classes.caseDetailsRow}>
        <Table.Cell>
          <If condition={!!errorLockedByUsername}>
            <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
          </If>
        </Table.Cell>
        <Table.Cell>
          <Link href={caseDetailsPath(errorId)} id={`Case details for ${defendantName}`}>
            {defendantName}
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
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={notes.length} />
        </Table.Cell>
        <Table.Cell>
          {Object.keys(exceptions).map((code, codeId) => (
            <GridRow key={`exception_${codeId}`}>
              {code}
              <b>&nbsp;{exceptions[code] > 1 ? `(${exceptions[code]})` : ""}</b>
            </GridRow>
          ))}
        </Table.Cell>
        <Table.Cell>
          {errorLockedByUsername && canUnlockCase(errorLockedByUsername) ? (
            <LockedByTag
              lockedBy={errorLockedByUsername}
              unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
            />
          ) : (
            <LockedByTag lockedBy={errorLockedByUsername} />
          )}
        </Table.Cell>
      </Table.Row>
      <If condition={!!showPreview}>
        {/* TODO: remove in-line styles */}
        <Table.Row className={classes.notesRow}>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }}></Table.Cell>
          <Table.Cell style={{ paddingTop: "0px" }} colSpan={2}>
            <NotePreview
              // TODO: put latestNote input into own variable & add elipsis logic
              latestNote={first100CharsOfMostRecentNote}
              displayDate={format(validatedMostRecentNoteDate, displayedDateFormat)}
              numberOfNotes={notes.length}
            />
          </Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </If>
      {triggerRow}
    </>
  )
}

export default CourtCaseListEntry
