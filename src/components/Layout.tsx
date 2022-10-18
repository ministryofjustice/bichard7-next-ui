import { Page, Footer, TopNav } from "govuk-react"
import { ReactNode } from "react"
import User from "../services/entities/User"
import { useRouter } from "next/router"

interface Props {
  children: ReactNode
  user: User
}

const Layout = ({ children, user }: Props) => {
  const { basePath } = useRouter()
  const header = (
    <div role={"navigation"}>
      <TopNav serviceTitle={"Bichard7"}>{[user.forenames, user.surname].join(" ")}</TopNav>
    </div>
  )
  return (
    <>
      <Page header={header}>{children}</Page>
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
