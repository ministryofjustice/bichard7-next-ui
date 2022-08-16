import { Button } from "govuk-react"
import { useRouter } from "next/router"
import CourtCase from "services/entities/CourtCase"
import Trigger from "services/entities/Trigger"

interface Props {
  trigger: Trigger
  courtCase: CourtCase
}

const ResolveTrigger: React.FC<Props> = ({ trigger, courtCase }: Props) => {
  const canResolve = !trigger.resolvedAt && !trigger.resolvedBy

  const { basePath, query } = useRouter()
  const resolveTriggerUrl = (courtCaseId: number, triggerId: number) =>
    `${basePath}/court-cases/${courtCaseId}?${new URLSearchParams({ ...query, resolveTrigger: triggerId.toString() })}`

  return (
    <form method="post" action={resolveTriggerUrl(courtCase.errorId, trigger.triggerId)}>
      <input type="text" hidden={true} name="resolveTrigger" value={trigger.triggerId} readOnly={true} />
      <Button type="submit" disabled={!canResolve}>
        {"Resolve trigger"}
      </Button>
    </form>
  )
}

export default ResolveTrigger
