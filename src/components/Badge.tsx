import ConditionalRender from "components/ConditionalRender"

interface BadgeProps {
  isRendered: boolean
  className?: string
  colour: "red" | "blue" | "purple"
  label: string
}

const Badge = ({ isRendered, className, colour, label }: BadgeProps) => {
  return (
    <ConditionalRender isRendered={isRendered}>
      <span className={`moj-badge moj-badge--${colour} moj-badge--large ${className}`}>{label}</span>
    </ConditionalRender>
  )
}

export default Badge
