import ConditionalRender from "components/ConditionalRender"

interface UrgentBadgeProps {
  isUrgent: boolean
  className?: string
}

const UrgentBadge = ({ isUrgent, className }: UrgentBadgeProps) => {
  return (
    <ConditionalRender isRendered={isUrgent}>
      <span className={`moj-badge moj-badge--red moj-badge--large ${className}`}>{"Urgent"}</span>
    </ConditionalRender>
  )
}

export default UrgentBadge
