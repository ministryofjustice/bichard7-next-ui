import { Button } from "govuk-react"
import { ReactNode } from "react"
import { gdsLightGrey, textPrimary, gdsMidGrey } from "utils/colours"

type Props = {
  children: ReactNode
  id?: string
  className?: string
  onClick?: () => void
}

const SecondaryButton = ({ id, children, className, onClick }: Props) => (
  <Button
    onClick={onClick}
    id={id}
    className={className}
    buttonColour={gdsLightGrey}
    buttonTextColour={textPrimary}
    buttonShadowColour={gdsMidGrey}
  >
    {children}
  </Button>
)

export default SecondaryButton
