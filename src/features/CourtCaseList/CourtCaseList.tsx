import { Paragraph, Table } from "govuk-react"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"
import { CourtCaseIndex } from "types/display/CourtCases"
import { CurrentUser } from "types/display/Users"
import { useCustomStyles } from "../../../styles/customStyles"
import CourtCaseListEntry from "./CourtCaseListEntry/CourtCaseListEntry"
import { CourtCaseListTableHeader } from "./CourtCaseListTableHeader"

interface Props {
  courtCases: CourtCaseIndex[]
  order?: QueryOrder
  currentUser: CurrentUser
}

const CourtCaseList: React.FC<Props> = ({ courtCases, order = "asc", currentUser }: Props) => {
  const { query } = useRouter()

  const recentlyUnlockedExceptionId = query.unlockException
  const recentlyUnlockedTriggerId = query.unlockTrigger

  const classes = useCustomStyles()

  return courtCases.length === 0 ? (
    <Paragraph>{"There are no court cases to show"}</Paragraph>
  ) : (
    <Table head={<CourtCaseListTableHeader order={order} />}>
      {courtCases.map((courtCase, index) => (
        <CourtCaseListEntry
          courtCase={courtCase}
          currentUser={currentUser}
          exceptionHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedExceptionId}
          triggerHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedTriggerId}
          key={`court-case-${courtCase.ptiurn}`}
          entityClassName={index % 2 == 1 ? classes["light-grey-background"] : ""}
        />
      ))}
    </Table>
  )
}

export default CourtCaseList
