import { SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS } from "config"
import { zonedTimeToUtc } from "date-fns-tz"
import { Footer } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import styled from "styled-components"
import shouldShowSwitchingFeedbackForm from "utils/shouldShowSwitchingFeedbackForm"
import User from "../services/entities/User"
import ConditionalRender from "./ConditionalRender"
import Header from "./Header"
import LinkButton from "./LinkButton"
import NavBar from "./NavBar"
import PageTemplate from "./PageTemplate"
import PhaseBanner from "./PhaseBanner"

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
  user: User
  bichardSwitch?: {
    display: boolean
    href?: string
    lastFeedbackFormSubmission?: Date
  }
}

const Layout = ({ children, user, bichardSwitch = { display: false } }: Props) => {
  const { basePath } = useRouter()
  let bichardSwitchUrl = bichardSwitch.href ?? "/bichard-ui/RefreshListNoRedirect"

  if (shouldShowSwitchingFeedbackForm(bichardSwitch.lastFeedbackFormSubmission)) {
    bichardSwitchUrl = `/bichard/switching-feedback?redirectTo=${encodeURIComponent(".." + bichardSwitchUrl)}`
  }

  return (
    <>
      <Header serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={user.username} />
      <NavBar groups={user.groups} />
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
