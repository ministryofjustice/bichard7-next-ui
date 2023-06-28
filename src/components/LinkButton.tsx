import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface Props extends React.ComponentProps<"button"> {
  children: ReactNode
  href: string
  buttonColour?: string
  buttonTextColour?: string
}

const LinkButton: React.FC<Props> = ({ children, href, buttonColour, buttonTextColour, ...buttonProps }: Props) => {
  const { asPath, basePath } = useRouter()
  return (
    <form method="get" action={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      <Button buttonColour={buttonColour} buttonTextColour={buttonTextColour} {...buttonProps}>
        {children}
      </Button>
    </form>
  )
}

export default LinkButton
