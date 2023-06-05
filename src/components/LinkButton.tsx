import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  href: string
}

const LinkButton: React.FC<Props> = ({ children, href }: Props) => {
  const { asPath, basePath } = useRouter()
  return (
    <form method="get" action={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      <div id={href}>
        <Button>{children}</Button>
      </div>
    </form>
  )
}

export default LinkButton
