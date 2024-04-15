import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { createUseStyles } from "react-jss"

interface LinkButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode
  href: string
  buttonColour?: string
  buttonTextColour?: string
  buttonShadowColour?: string
}

interface ReactiveLinkButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

interface SaveLinkButtonProps extends React.ComponentProps<"button"> {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const useStyles = createUseStyles({
  "save-button": {
    marginTop: "0.94rem",
    marginBottom: 0
  }
})

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
  onClick,
  ...buttonProps
}: ReactiveLinkButtonProps) => {
  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onClick(event)
  }

  return (
    <LinkButton href={"#"} onClick={handleOnClick} {...buttonProps}>
      {children}
    </LinkButton>
  )
}

const SaveLinkButton: React.FC<SaveLinkButtonProps> = ({ onClick, ...buttonProps }: SaveLinkButtonProps) => {
  const classes = useStyles()

  return (
    <ReactiveLinkButton {...buttonProps} onClick={onClick} className={`${classes["save-button"]}`}>
      {"Save Correction"}
    </ReactiveLinkButton>
  )
}

export { LinkButton, ReactiveLinkButton, SaveLinkButton }
export default LinkButton
