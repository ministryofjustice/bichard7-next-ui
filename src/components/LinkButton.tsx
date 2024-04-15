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

interface SaveLinkButtonProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
  as?: keyof JSX.IntrinsicElements
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

const SaveLinkButton: React.FC<SaveLinkButtonProps> = ({ onClick, ...buttonProps }: SaveLinkButtonProps) => {
  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onClick(event)
  }

  return (
    <StyledSaveLinkButton onClick={handleOnClick} {...buttonProps}>
      {"Save Correction"}
    </StyledSaveLinkButton>
  )
}

export { LinkButton, SaveLinkButton }
export default LinkButton
