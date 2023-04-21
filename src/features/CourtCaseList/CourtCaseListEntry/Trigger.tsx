import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"

interface TriggerProps {
  triggerCode: string
}

export const Trigger = ({ triggerCode }: TriggerProps) => (
  <span>
    {getTriggerWithDescription(triggerCode)}
    <br />
  </span>
)
