import { useState } from "react"
import type { PncCourtCase } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import { CCR, CourtCaseHeader, CrimeOffenceReference, CourtCase, Offence } from "./PncDetails.styles"
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

  return (
    <CourtCase key={courtCaseReference}>
      <CourtCaseHeader className="courtcase-toggle" onClick={toggle}>
        <CCR className="govuk-heading-m">{courtCaseReference}</CCR>
        <CrimeOffenceReference>
          <div className={"heading"}>{"Crime Offence Reference"}</div>
          <div id={"crime-offence-reference"}>{crimeOffenceReference || "-"}</div>
        </CrimeOffenceReference>
      </CourtCaseHeader>

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
