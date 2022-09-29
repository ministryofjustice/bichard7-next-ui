import { Page, Footer, TopNav } from "govuk-react"
import { addBasePath } from "next/dist/shared/lib/router/router"
import { ReactNode } from "react"
import User from "../services/entities/User"
import IconTitle from "./govuk-react-forked/IconTitle"
import Crown from "./govuk-react-forked/CrownIcon"

interface Props {
  children: ReactNode
  user: User
}

// We're overriding Company to implement an svg fix for the govuk-react-icon-crown repo
const Company = (
  <IconTitle icon={<Crown width="36" height="32" fill="currentColor" title="GOV.UK" />}>{"GOV.UK"}</IconTitle>
)

const Layout = ({ children, user }: Props) => {
  const header = (
    <TopNav serviceTitle={"Bichard7"} company={Company}>
      {[user.forenames, user.surname].join(" ")}
    </TopNav>
  )
  return (
    <>
      <Page header={header}>{children}</Page>
      <Footer
        copyright={{
          image: {
            height: 102,
            src: addBasePath("/images/govuk-crest.png"),
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
