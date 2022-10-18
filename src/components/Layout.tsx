import { Footer } from "govuk-react"
import { ReactNode } from "react"
import User from "../services/entities/User"
import { useRouter } from "next/router"
import MojHeader from "./Header"

interface Props {
  children: ReactNode
  user: User
}

const Layout = ({ children }: Props) => {
  const { basePath } = useRouter()
  return (
    <>
      <MojHeader serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={"User Name"} />
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
