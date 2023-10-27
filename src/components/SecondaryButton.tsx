import { Button } from "govuk-react"
import { gdsLightGrey, textPrimary, gdsMidGrey } from "utils/colours"

type Props = {
  text: string
  id?: string
  className?: string
  onClick?: () => void
}

const SecondaryButton = ({ id, text, className, onClick }: Props) => (
  <Button
    onClick={onClick}
    id={id}
    className={className}
    buttonColour={gdsLightGrey}
    buttonTextColour={textPrimary}
    buttonShadowColour={gdsMidGrey}
  >
    {text}
  </Button>
)

export default SecondaryButton
