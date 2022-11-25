interface PhaseBannerProps {
  phase: string
}

const PhaseBanner: React.FC<PhaseBannerProps> = ({ phase }: PhaseBannerProps) => {
  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
        <span className="govuk-phase-banner__text">
          {"This is a prototype. Content is likely to change rapidly – "}
          {/* TODO: add feedback page link */}
          <a className="govuk-link" href="/">
            {"help us to improve it"}
          </a>
        </span>
      </p>
    </div>
  )
}

export default PhaseBanner
