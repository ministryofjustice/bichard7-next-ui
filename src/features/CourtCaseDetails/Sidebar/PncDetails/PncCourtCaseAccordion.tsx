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
} from "./PncDetails.styles"
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
  const [open, setOpen] = useState<boolean>(index === 0 ? true : false)
  const toggle = () => {
    setOpen(!open)
  }

  const chevronPosition = open ? "govuk-accordion-nav__chevron--up" : "govuk-accordion-nav__chevron--down"

  return (
    <CourtCase key={courtCaseReference}>
      <CourtCaseHeaderContainer className="courtcase-toggle" onClick={toggle}>
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

      {open &&
        offences?.map(({ offence: details, adjudication, disposals }, i) => (
          <Offence className="pnc-offence" key={`${i}-${details.sequenceNumber}`}>
            <PncOffenceDetails details={details} adjudication={adjudication} />
            {disposals?.map((d, j) => <Disposal key={`${j}-${d.type}`} {...d} />)}
          </Offence>
        ))}
    </CourtCase>
  )
}

export default PncCourtCaseAccordion
