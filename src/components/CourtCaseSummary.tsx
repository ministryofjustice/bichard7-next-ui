import CourtCase from "entities/CourtCase"

interface Props {
  courtCase: CourtCase
}

const CourtCaseSummary = ({ courtCase }: Props) => {
  return (
    <div>
      <p>
        {"PTIURN:"} {courtCase.ptiurn}
      </p>
    </div>
  )
}

export default CourtCaseSummary
