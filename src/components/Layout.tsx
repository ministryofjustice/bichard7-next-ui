import { Footer } from "govuk-react"
import { ReactNode } from "react"
import User from "../services/entities/User"
import { useRouter } from "next/router"
import Header from "./Header"
import NavBar from "./NavBar"
import PhaseBanner from "./PhaseBanner"
import PageTemplate from "./PageTemplate"
import styled from "styled-components"
import LinkButton from "./LinkButton"

interface Props {
  children: ReactNode
  user: User
}

const Banner = styled.div`
  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid #b1b4b6;
`

const PhaseWrapper = styled.div`
  > .govuk-phase-banner {
    border: none;
  }
`

const OldBichardLink = styled(LinkButton)`
  margin-bottom: 0;
`

const Layout = ({ children, user }: Props) => {
  const { basePath } = useRouter()

  return (
    <>
      <Header serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={user.username} />
      <NavBar groups={user.groups} />
      <PageTemplate>
        <Banner>
          <PhaseWrapper>
            <PhaseBanner phase={"beta"} />
          </PhaseWrapper>

          <OldBichardLink href="/bichard-ui/InitialRefreshList">{"Switch to old Bichard"}</OldBichardLink>
        </Banner>
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
