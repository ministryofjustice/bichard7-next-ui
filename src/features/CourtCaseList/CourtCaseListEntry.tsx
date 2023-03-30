import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { GridRow, Link, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { gdsLightGrey } from "utils/colours"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { displayedDateFormat } from "utils/formattedDate"
import {
  filterUserNotes,
  getFirst100CharsOfMostRecentNote,
  getMostRecentNote,
  validateMostRecentNoteDate
} from "./CourtCaseListEntryHelperFunction"
import { NotePreview, NotePreviewButton } from "./NotePreviewButton"
import CaseUnlockedTag from "./tags/CaseUnlockedTag"
import LockedByTag from "./tags/LockedByTag/LockedByTag"
import ResolvedTag from "./tags/ResolvedTag"
import UrgentTag from "./tags/UrgentTag"

const useStyles = createUseStyles({
  caseDetailsRow: {
    verticalAlign: "top",
    borderColor: "unset"
  },
  triggersRow: {
    verticalAlign: "top",
    backgroundColor: gdsLightGrey
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
  exceptionHasBeenRecentlyUnlocked: boolean
  triggerHasBeenRecentlyUnlocked: boolean
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  currentUser,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked
}: Props) => {
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
    resolutionTimestamp,
    notes
  } = courtCase
  const classes = useStyles()
  const { basePath, query } = useRouter()
  const searchParams = new URLSearchParams(encode(query))
  const caseDetailsPath = (id: number) => `${basePath}/court-cases/${id}`
  const unlockCaseWithReasonPath = (reason: "Trigger" | "Exception", caseId: string) => {
    deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

    searchParams.append(`unlock${reason}`, caseId)
    return `${basePath}/?${searchParams}`
  }
  const canUnlockCase = (lockedUsername: string): boolean => {
    return currentUser.groups.includes("Supervisor") || currentUser.username === lockedUsername
  }

  const exceptions = groupErrorsFromReport(errorReport)
  const [showPreview, setShowPreview] = useState(false)
  const userNotes = filterUserNotes(notes)
  const numberOfNotes = userNotes.length
  const mostRecentUserNote = getMostRecentNote(userNotes)

  const triggerRow =
    triggers.length > 0 ? (
      <Table.Row className={classes.triggersRow}>
        <Table.Cell>
          <ConditionalRender isRendered={!!triggerLockedByUsername}>
            <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
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
          {<CaseUnlockedTag isCaseUnlocked={triggerHasBeenRecentlyUnlocked && !errorLockedByUsername} />}
        </Table.Cell>
      </Table.Row>
    ) : (
      <></>
    )

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
            <ResolvedTag isResolved={resolutionTimestamp !== null} />
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
          {<CaseUnlockedTag isCaseUnlocked={exceptionHasBeenRecentlyUnlocked && !errorLockedByUsername} />}
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
            <NotePreview
              latestNote={getFirst100CharsOfMostRecentNote(userNotes)}
              displayDate={validateMostRecentNoteDate(mostRecentUserNote)}
              numberOfNotes={numberOfNotes}
            />
          </Table.Cell>
          <Table.Cell />
        </Table.Row>
      )}
      {triggerRow}
    </>
  )
}

export default CourtCaseListEntry
