/* eslint-disable react-hooks/rules-of-hooks */
import DateTime from "components/DateTime"
import If from "components/If"
import { format } from "date-fns"
import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { GridRow, Link, Paragraph, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import type { QueryOrder } from "types/CaseListQueryParams"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import { displayedDateFormat } from "utils/formattedDate"
import LockedByTag from "./tags/LockedByTag"
import NotePreview, { PreviewNotes } from "./tags/NotePreview"
import UrgentTag from "./tags/UrgentTag"

const useStyles = createUseStyles({
  caseDetailsRow: {
    verticalAlign: "top"
  },
  triggersRow: {
    verticalAlign: "top",
    backgroundColor: "#f3f2f1" // GDS light-grey color
  },
  flexBox: {
    display: "flex"
  }
})

interface Props {
  courtCases: CourtCase[]
  order?: QueryOrder
  currentUser: User
}

const CourtCaseList: React.FC<Props> = ({ courtCases, order = "asc", currentUser }: Props) => {
  const classes = useStyles()
  const { basePath, query } = useRouter()

  let searchParams = new URLSearchParams(encode(query))
  searchParams = deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`
  const caseDetailsPath = (id: number) => `${basePath}/court-cases/${id}`
  const unlockCaseWithReasonPath = (reason: "Trigger" | "Exception", caseId: string) => {
    searchParams.append(`unlock${reason}`, caseId)
    return `${basePath}/?${searchParams}`
  }

  const canUnlockCase = (lockedUsername: string): boolean => {
    return currentUser.groups.includes("Supervisor") || currentUser.username === lockedUsername
  }

  const tableHead = (
    <Table.Row>
      <Table.Cell setWidth="20px"></Table.Cell>
      <Table.CellHeader setWidth="178px">
        <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("defendantName")} id="defendant-name-sort">
            {"Defendant Name"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth="115px">
        <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("courtDate")} id="court-date-sort">
            {"Court Date"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth="175px">
        <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("courtName")} id="court-name-sort">
            {"Court Name"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth="125px">
        <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("ptiurn")} id="ptiurn-sort">
            {"PTIURN"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth="100px">
        <ColumnOrderIcons columnName={"isUrgent"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("isUrgent")} id="is-urgent-sort">
            {"Urgent"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth="85px">{"Notes"}</Table.CellHeader>
      <Table.CellHeader setWidth="150px">
        <ColumnOrderIcons columnName={"reason"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("reason")} id="exceptions">
            {"Reason"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
      <Table.CellHeader setWidth="160px">
        <ColumnOrderIcons columnName={"lockedBy"} currentOrder={query.order} orderBy={query.orderBy}>
          <Link href={orderByParams("lockedBy")} id="locked-by-sort">
            {"Locked By"}
          </Link>
        </ColumnOrderIcons>
      </Table.CellHeader>
    </Table.Row>
  )
  const tableBody: JSX.Element[] = []
  courtCases.forEach(
    (
      {
        errorId,
        courtDate,
        ptiurn,
        defendantName,
        courtName,
        triggers,
        errorReport,
        isUrgent,
        errorLockedByUsername,
        triggerLockedByUsername
      },
      idx
    ) => {
      const [showPreview, setShowPreview] = useState(false)
      console.log("initial state: should be false-- ", showPreview)
      const exceptions = groupErrorsFromReport(errorReport)
      tableBody.push(
        <Table.Row key={`case-details-row-${idx}`} className={classes.caseDetailsRow}>
          <Table.Cell>
            <If condition={!!errorLockedByUsername}>
              <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
            </If>
          </Table.Cell>
          <Table.Cell>
            <Link href={caseDetailsPath(courtCases[idx].errorId)} id={`Case details for ${defendantName}`}>
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
            <NotePreview
              initialState={showPreview}
              stateSwitcher={setShowPreview}
              numberOfNotes={courtCases[idx].notes.length}
            />
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
      )
      const allNotes = courtCases[idx].notes.map((note) => note.createdAt)
      const latestNoteCreatedDate = allNotes.sort().slice(-1)[0]
      const validatedLatestNoteCreatedDate = new Date(latestNoteCreatedDate.toString().slice(0, 10))
      const mostRecentNote = courtCases[idx].notes.filter((note) => note.createdAt === latestNoteCreatedDate)
      const mostRecentNoteText = mostRecentNote[0].noteText
      // const [showPreview, setShowPreview] = useState(false)
      // flesh out state switcher- use what we already had.
      // pass in the switcher function to the PreviewNote -> clickable button component
      // re-think container logic e.g break out clickable buttons. and displayed note number
      // css / jss alignment

      tableBody.push(
        <If condition={!!showPreview}>
          <Table.Row key={`note-preview-row-${idx}`}>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell colSpan={2}>
              <PreviewNotes
                latestNote={mostRecentNoteText.slice(0, 100)}
                displayDate={format(validatedLatestNoteCreatedDate, displayedDateFormat)}
                switcher={setShowPreview}
                currentState={showPreview}
              />
            </Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </If>
      )

      if (triggers.length > 0) {
        tableBody.push(
          <Table.Row key={`triggers-row-${idx}`} className={classes.triggersRow}>
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
        )
      }
    }
  )

  if (courtCases.length === 0) {
    return <Paragraph>{"There are no court cases to show"}</Paragraph>
  }

  return <Table head={tableHead}>{tableBody}</Table>
}

export default CourtCaseList
