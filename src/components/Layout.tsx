import { Page, Footer } from "govuk-react"
import { ReactNode } from "react"
import User from "../services/entities/User"
import IconTitle from "./govuk-react-forked/IconTitle"
import Crown from "./govuk-react-forked/CrownIcon"
import { useRouter } from "next/router"
import Header from "components/Header"

interface Props {
  children: ReactNode
  user: User
}

// We're overriding Company to implement an svg fix for the govuk-react-icon-crown repo
const Company = (
  <IconTitle icon={<Crown width="36" height="32" fill="currentColor" title="GOV.UK" />}>{"GOV.UK"}</IconTitle>
)

const Layout = ({ children, user }: Props) => {
  const { basePath } = useRouter()
  return (
    <>
      <Header />
      {children}
      <Footer
        copyright={{
          image: {
            height: 102,
            src: `${basePath}/images/govuk-crest.png`,
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
