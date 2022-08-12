import { Button, Link } from "govuk-react"
import { useRouter } from "next/router"
import Trigger from "services/entities/Trigger"

interface Props {
  trigger: Trigger
}

const ResolveTrigger: React.FC<Props> = ({ trigger }: Props) => {
  const canResolve = trigger.resolvedAt === undefined && trigger.resolvedBy === undefined

  const { basePath, asPath } = useRouter()

  return (
    <Link href={`${basePath}${asPath}?resolveTrigger=${trigger.triggerId}`}>
      <Button disabled={!canResolve}>{"Resolve trigger"}</Button>
    </Link>
  )
}

export default ResolveTrigger
