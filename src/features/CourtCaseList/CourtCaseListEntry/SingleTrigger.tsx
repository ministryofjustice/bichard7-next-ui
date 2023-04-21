import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"

interface SingleTriggerProps {
  triggerCode: string
}

export const SingleTrigger = ({ triggerCode }: SingleTriggerProps) => (
  <span>
    {getTriggerWithDescription(triggerCode)}
    <br />
  </span>
)
