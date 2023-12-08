import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import ResolvedTag from "features/CourtCaseList/tags/ResolvedTag"
import UrgentTag from "features/CourtCaseList/tags/UrgentTag"
import { Link, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import { DisplayNote } from "types/display/Notes"
import { displayedDateFormat } from "utils/formattedDate"
import { LOCKED_ICON_URL } from "utils/icons"
import { NotePreviewButton } from "./NotePreviewButton"

interface CaseDetailsRowProps {
  courtDate: Date | null
  courtName: string
  defendantName: string | null
  errorId: number
  errorLockedByUsername: string | null | undefined
  isResolved: boolean
  isUrgent: boolean
  notes: DisplayNote[]
  ptiurn: string
  rowClassName: string
  reasonCell?: JSX.Element
  lockTag: JSX.Element
  previousPath: string | null
  showPreview: boolean
  onPreviewButtonClick: () => void
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
  courtDate,
  courtName,
  defendantName,
  errorId,
  errorLockedByUsername,
  isResolved,
  isUrgent,
  notes,
  ptiurn,
  rowClassName,
  reasonCell,
  lockTag,
  previousPath,
  showPreview,
  onPreviewButtonClick
}: CaseDetailsRowProps) => {
  const { basePath } = useRouter()
  const userNotes = filterUserNotes(notes)
  const numberOfNotes = userNotes.length
  const classes = useStyles()

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <Table.Row className={`${classes.caseDetailsRow} ${rowClassName}`}>
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
          <NotePreviewButton previewState={showPreview} onClick={onPreviewButtonClick} numberOfNotes={numberOfNotes} />
        </Table.Cell>
        <Table.Cell>{reasonCell}</Table.Cell>
        <Table.Cell>{lockTag}</Table.Cell>
      </Table.Row>
    </>
  )
}
