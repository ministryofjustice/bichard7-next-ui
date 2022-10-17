import Link from "./Link"
import Image from "next/image"
import { useRouter } from "next/router"


interface HeaderProps {
  serviceName: string
}
const Header: React.FC<HeaderProps> = ({ serviceName }: HeaderProps) => {
  const { basePath } = useRouter()
  return (
    <header className="govuk-header " role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__logo">
          <Image src={`${basePath}/images/govuk-logotype-crown.png`} width="36" height="32" alt="gov_logo" />

          <div className="govuk-header__content">
            <Link href="/bichard">{serviceName}</Link>
          </div>
          <span className="govuk-header__logotype-text">{" GOV.UK"}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
