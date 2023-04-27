export const PreviewButton = () => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
      <span className="govuk-accordion__show-all-text">{"Preview"}</span>
    </>
  )
}

export const HideButton = () => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron"></span>
      <span className="govuk-accordion__show-all-text">{"Hide"}</span>
    </>
  )
}
