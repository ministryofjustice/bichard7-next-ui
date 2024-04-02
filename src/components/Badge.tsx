import ConditionalRender from "components/ConditionalRender"

export enum BadgeColours {
  Red = "red",
  Blue = "blue",
  Purple = "purple",
  Grey = "grey",
  Green = "green"
}

interface BadgeProps {
  isRendered: boolean
  className?: string
  colour: BadgeColours
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
