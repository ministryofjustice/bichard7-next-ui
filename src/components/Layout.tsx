import { Page, Footer, TopNav } from "govuk-react"
import { addBasePath } from "next/dist/shared/lib/router/router"
import { ReactNode } from "react"
import User from "../entities/User"

interface Props {
  children: ReactNode
  user: User
}

const Layout = ({ children, user }: Props) => {
  const header = <TopNav>{[user.forenames, user.surname].join(" ")}</TopNav>
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
