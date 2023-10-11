import { Footer } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import styled from "styled-components"
import ConditionalRender from "./ConditionalRender"
import Header from "./Header"
import LinkButton from "./LinkButton"
import NavBar from "./NavBar"
import PageTemplate from "./PageTemplate"
import PhaseBanner from "./PhaseBanner"
import { DisplayFullUser } from "types/display/Users"
import Permission from "types/Permission"

const Banner = styled.div`
  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid #b1b4b6;

  > .govuk-phase-banner {
    border: none;
  }
`

const BichardSwitch = styled(LinkButton)`
  margin-bottom: 0;
`
interface Props {
  children: ReactNode
  user: DisplayFullUser
  bichardSwitch?: {
    display: boolean
    href?: string
    displaySwitchingSurveyFeedback: boolean
  }
}

const Layout = ({
  children,
  user,
  bichardSwitch = { display: false, displaySwitchingSurveyFeedback: false }
}: Props) => {
  const { basePath } = useRouter()
  let bichardSwitchUrl = bichardSwitch.href ?? "/bichard-ui/RefreshListNoRedirect"

  if (bichardSwitch.displaySwitchingSurveyFeedback) {
    bichardSwitchUrl = `/bichard/switching-feedback?redirectTo=${encodeURIComponent(".." + bichardSwitchUrl)}`
  }

  return (
    <>
      <Header serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={user.username} />
      <NavBar
        hasAccessToReports={user.hasAccessTo[Permission.ViewReports]}
        hasAccessToUserManagement={user.hasAccessTo[Permission.ViewUserManagement]}
      />
      <PageTemplate>
        <Banner>
          <PhaseBanner phase={"beta"} />

          <ConditionalRender isRendered={bichardSwitch.display}>
            <BichardSwitch href={bichardSwitchUrl}>{"Switch to old Bichard"}</BichardSwitch>
          </ConditionalRender>
        </Banner>
        {children}
      </PageTemplate>
      <Footer
        copyright={{
          image: {
            height: 102,
            src: `${basePath} /govuk_assets/images / govuk - crest.png`,
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
