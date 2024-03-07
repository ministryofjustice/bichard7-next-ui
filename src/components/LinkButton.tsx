import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface LinkButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode
  href: string
  buttonColour?: string
  buttonTextColour?: string
  buttonShadowColour?: string
}

interface ReactiveLinkButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode
  buttonColour?: string
  buttonTextColour?: string
  buttonShadowColour?: string
  onClick: (event: React.MouseEvent<HTMLElement>) => void
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

const ReactiveLinkButton: React.FC<ReactiveLinkButtonProps> = ({
  children,
  buttonColour,
  buttonShadowColour,
  buttonTextColour,
  onClick,
  ...buttonProps
}: ReactiveLinkButtonProps) => {
  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onClick(event)
  }

  return (
    <LinkButton
      href={"#"}
      onClick={handleOnClick}
      buttonColour={buttonColour}
      buttonTextColour={buttonTextColour}
      buttonShadowColour={buttonShadowColour}
      {...buttonProps}
    >
      {children}
    </LinkButton>
  )
}

export { LinkButton, ReactiveLinkButton }
export default LinkButton
