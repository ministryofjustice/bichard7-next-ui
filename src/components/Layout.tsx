import { Page, Footer } from "govuk-react"
import { ReactNode } from "react"
import User from "../services/entities/User"
import { useRouter } from "next/router"
import Header from "./Header"

interface Props {
  children: ReactNode
  user: User
}

const Layout = ({ children, user }: Props) => {
  const { basePath } = useRouter()
  const header = <Header serviceName={"Bichard7"} organisationName={"Minsitry of Justice"} userName={user.username} />

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
