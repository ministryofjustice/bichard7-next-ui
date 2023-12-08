import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import ResolvedTag from "features/CourtCaseList/tags/ResolvedTag"
import UrgentTag from "features/CourtCaseList/tags/UrgentTag"
import { Link, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import { displayedDateFormat } from "utils/formattedDate"
import { LOCKED_ICON_URL } from "utils/icons"
import { NotePreviewButton } from "./NotePreviewButton"
import { useState } from "react"
import { NotePreviewRow } from "./NotePreviewRow"
import { DisplayPartialCourtCase } from "types/display/CourtCases"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: JSX.Element
  lockTag?: JSX.Element
  previousPath: string | null
}

const useStyles = createUseStyles({
  caseDetailsRow: {
    verticalAlign: "top"
  },
  flexBox: {
    display: "flex"
  },
  notesRow: {
    borderTop: "white solid"
  }
})

export const CaseDetailsRow = ({ courtCase, reasonCell, lockTag, previousPath }: CaseDetailsRowProps) => {
  const {
    resolutionTimestamp,
    notes,
    errorLockedByUsername,
    defendantName,
    errorId,
    courtDate,
    courtName,
    ptiurn,
    isUrgent
  } = courtCase
  const { basePath } = useRouter()
  const [showPreview, setShowPreview] = useState(true)
  const userNotes = filterUserNotes(notes)
  const numberOfNotes = userNotes.length
  const classes = useStyles()
  const isResolved = resolutionTimestamp !== null

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <Table.Row className={`${classes.caseDetailsRow}`}>
        <Table.Cell>
          <ConditionalRender isRendered={!!errorLockedByUsername}>
            <Image src={LOCKED_ICON_URL} priority width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </Table.Cell>
        <Table.Cell>
          <Link href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`}>
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
        <Table.Cell>{reasonCell}</Table.Cell>
        <Table.Cell>{lockTag}</Table.Cell>
      </Table.Row>
      {notes.length > 0 && !showPreview && <NotePreviewRow notes={notes} />}
    </>
  )
}
