import { useCourtCase } from "context/CourtCaseContext"
import { UpdatedDate, CourtCases } from "./PncDetails.styles"
import PncCourtCaseAccordion from "./PncCourtCaseAccordion"
import { formatDisplayedDate } from "utils/date/formattedDate"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  return (
    <>
      <UpdatedDate id="pnc-details-update-date">{`Updated ${pncQueryDate ? formatDisplayedDate(pncQueryDate, "dd/MM/yyyy HH:mm:ss") : "-"}`}</UpdatedDate>
      <CourtCases>
        {pncQuery?.courtCases?.map((courtCase, i) => (
          <PncCourtCaseAccordion key={i} index={i} pncCourtCase={courtCase} />
        ))}
      </CourtCases>
    </>
  )
}

export default PncDetails
