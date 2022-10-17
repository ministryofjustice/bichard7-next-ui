import { ReactNode } from "react"
interface Props {
  children: ReactNode
  href: string
}
const Link = ({ href, children }: Props) => (
  <a href={href} className="govuk-link">
    {children}
  </a>
)
export default Link
