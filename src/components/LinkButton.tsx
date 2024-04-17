import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { StyledSaveLinkButton } from "./LinkButton.styles"

interface LinkButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode
  href: string
  buttonColour?: string
  buttonTextColour?: string
  buttonShadowColour?: string
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  buttonColour,
  buttonShadowColour,
  buttonTextColour,
  ...buttonProps
}: LinkButtonProps) => {
  const { asPath, basePath } = useRouter()

  return (
    <a href={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      <Button
        buttonColour={buttonColour}
        buttonTextColour={buttonTextColour}
        buttonShadowColour={buttonShadowColour}
        {...buttonProps}
      >
        {children}
      </Button>
    </a>
  )
}

interface SaveLinkButtonProps extends React.ComponentProps<"button"> {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
  id: string
  disabled?: boolean
}

const SaveLinkButton: React.FC<SaveLinkButtonProps> = ({ id, disabled, onClick }: SaveLinkButtonProps) => {
  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onClick(event)
  }

  const saveButtonProps = {
    id,
    disabled,
    onClick: handleOnClick
  }

  return <StyledSaveLinkButton {...saveButtonProps}>{"Save Correction"}</StyledSaveLinkButton>
}

export { LinkButton, SaveLinkButton }
export default LinkButton
