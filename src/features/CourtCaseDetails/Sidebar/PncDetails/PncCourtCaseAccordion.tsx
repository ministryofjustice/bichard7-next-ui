import { useState } from "react"
import type { PncCourtCase } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import {
  CCR,
  CourtCaseHeaderContainer,
  CrimeOffenceReference,
  CourtCase,
  Offence,
  CourtCaseHeader,
  ChevronContainer
} from "./PncCourtCaseAccordian.styles"
import PncOffenceDetails from "./PncOffenceDetails"
import Disposal from "./Disposal"

interface PncCourtCaseAccordionProps {
  index: number
  pncCourtCase: PncCourtCase
}

const PncCourtCaseAccordion = ({
  index,
  pncCourtCase: { courtCaseReference, crimeOffenceReference, offences }
}: PncCourtCaseAccordionProps) => {
  const [isContentVisible, setIsContentVisible] = useState<boolean>(index === 0 ? true : false)
  const toggleContentVisibility = () => setIsContentVisible((previousState) => !previousState)

  const chevronPosition = isContentVisible ? "govuk-accordion-nav__chevron--up" : "govuk-accordion-nav__chevron--down"

  return (
    <CourtCase key={courtCaseReference}>
      <CourtCaseHeaderContainer
        className="courtcase-toggle"
        onClick={toggleContentVisibility}
        aria-expanded={isContentVisible}
        aria-controls={`CCR-${courtCaseReference}-content`}
        aria-label={`CCR-${courtCaseReference}`}
      >
        <CourtCaseHeader>
          <CCR className="govuk-heading-m">{courtCaseReference}</CCR>
          <CrimeOffenceReference>
            <div className={"heading"}>{"Crime Offence Reference"}</div>
            <div id={"crime-offence-reference"}>{crimeOffenceReference || "-"}</div>
          </CrimeOffenceReference>
        </CourtCaseHeader>

        <ChevronContainer>
          <span className={`govuk-accordion-nav__chevron ${chevronPosition} chevron`}></span>
        </ChevronContainer>
      </CourtCaseHeaderContainer>

      {isContentVisible && (
        <div id={`CCR-${courtCaseReference}-content`}>
          {offences?.map(({ offence: details, adjudication, disposals }, i) => (
            <Offence className="pnc-offence" key={`${i}-${details.sequenceNumber}`}>
              <PncOffenceDetails details={details} adjudication={adjudication} />
              {disposals?.map((d, j) => <Disposal key={`${j}-${d.type}`} {...d} />)}
            </Offence>
          ))}
        </div>
      )}
    </CourtCase>
  )
}

export default PncCourtCaseAccordion
