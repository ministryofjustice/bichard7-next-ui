import { BackLink, SkipLink } from "govuk-react"
import { BackLinkWrapper, LinksRow } from "./FeedbackHeaderLinks.styles"
import Form from "./Form"

type Props = {
  csrfToken: string
  backLinkUrl: string
  skipLinkUrl?: string
}
const FeedbackHeaderLinks = ({ csrfToken, backLinkUrl, skipLinkUrl }: Props) => {
  return (
    <LinksRow>
      <BackLinkWrapper>
        <BackLink href={backLinkUrl} onClick={function noRefCheck() {}}>
          {"Back"}
        </BackLink>
      </BackLinkWrapper>
      <Form method="POST" action={skipLinkUrl} csrfToken={csrfToken}>
        <SkipLink id="skip-feedback" type="submit">
          {"Skip feedback"}
        </SkipLink>
      </Form>
    </LinksRow>
  )
}

export default FeedbackHeaderLinks
