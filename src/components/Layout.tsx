import { Footer } from "govuk-react"
import { ReactNode } from "react"
import User from "../services/entities/User"
import { useRouter } from "next/router"
import Header from "./Header"
import NavBar from "./NavBar"
import PhaseBanner from "./PhaseBanner"
import PageTemplate from "./PageTemplate"

interface Props {
  children: ReactNode
  user: User
}

const Layout = ({ children, user }: Props) => {
  const { basePath } = useRouter()

  return (
    <>
      <Header serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={user.username} />
      <NavBar groups={user.groups} />
      <PageTemplate>
        <PhaseBanner phase={"beta"} />
        {children}
      </PageTemplate>
      <Footer
        copyright={{
          image: {
            height: 102,
            src: `${basePath}/govuk_assets/images/govuk-crest.png`,
            width: 125
          },
          link: "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
          text: "Crown copyright"
        }}
      />
    </>
  )
}

export default Layout
