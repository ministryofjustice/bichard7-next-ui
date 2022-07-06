import CourtCase from "entities/CourtCase"

interface Props {
  courtCase: CourtCase
}

const CourtCaseSummary = ({ courtCase }: Props) => {
  return (
    <div>
      <p>
        {"error ID:"} {courtCase.errorId}
      </p>
    </div>
  )
}

export default CourtCaseSummary
