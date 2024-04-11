import { useState } from "react"
import {
  AccordionButton,
  AccordionContent,
  AccordionHeader,
  AccordionHeading,
  AccordionToggle
} from "./Accordion.styles"

type Props = {
  id: string
  heading: string
  children: React.ReactNode
}

const Accordion = ({ id, heading, children }: Props) => {
  const [isContentVisible, setIsContentVisible] = useState(false)

  const toggleContentVisibility = () => setIsContentVisible((previousValue) => !previousValue)

  return (
    <div className="govuk-accordion__section">
      <AccordionHeader className="govuk-accordion__section-header">
        <AccordionHeading className="govuk-accordion__section-heading">
          <AccordionButton
            type="button"
            aria-controls={`${id}-content`}
            className="govuk-accordion__section-button"
            aria-expanded="false"
            aria-label={heading}
            onClick={toggleContentVisibility}
          >
            <AccordionToggle className="govuk-accordion__section-toggle">
              <span className="govuk-accordion__section-toggle-focus">
                <span
                  className={`govuk-accordion-nav__chevron ${!isContentVisible ? "govuk-accordion-nav__chevron--down" : ""}`}
                ></span>
                <span className="govuk-accordion__section-toggle-text">{heading}</span>
              </span>
            </AccordionToggle>
          </AccordionButton>
        </AccordionHeading>
      </AccordionHeader>
      {isContentVisible && <AccordionContent className="accordion__content">{children}</AccordionContent>}
    </div>
  )
}

export default Accordion
