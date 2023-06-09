import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  href: string
  className?: string
}

const LinkButton: React.FC<Props> = ({ children, href, className }: Props) => {
  const { asPath, basePath } = useRouter()
  return (
    <form method="get" action={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      <Button className={className}>{children}</Button>
    </form>
  )
}

export default LinkButton
