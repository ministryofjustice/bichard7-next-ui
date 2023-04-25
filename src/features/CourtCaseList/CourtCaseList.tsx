import { Paragraph, Table } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import type { QueryOrder } from "types/CaseListQueryParams"
import { useCustomStyles } from "../../../styles/customStyles"
import CourtCaseListEntry from "./CourtCaseListEntry/CourtCaseListEntry"
import { CourtCaseListTableHeader } from "./CourtCaseListTableHeader"

interface Props {
  courtCases: CourtCase[]
  order?: QueryOrder
  currentUser: User
}

const CourtCaseList = ({ courtCases, order = "asc", currentUser }: Props) => {
  const { query } = useRouter()

  const recentlyUnlockedExceptionId = query.unlockException
  const recentlyUnlockedTriggerId = query.unlockTrigger

  const classes = useCustomStyles()

  if (courtCases.length === 0) {
    return <Paragraph>{"There are no court cases to show"}</Paragraph>
  }

  return (
    <Table head={<CourtCaseListTableHeader order={order} />}>
      {courtCases.map((courtCase, index) => (
        <CourtCaseListEntry
          courtCase={courtCase}
          currentUser={currentUser}
          exceptionHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedExceptionId}
          triggerHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedTriggerId}
          key={`court-case-${courtCase.ptiurn}`}
          entityClassname={index % 2 == 1 ? classes["light-grey-background"] : ""}
        />
      ))}
    </Table>
  )
}

export default CourtCaseList
