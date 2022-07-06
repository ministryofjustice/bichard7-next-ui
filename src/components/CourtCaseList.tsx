import CourtCase from "entities/CourtCase"
import CourtCaseSummary from "./CourtCaseSummary"

interface Props {
  courtCases: CourtCase[]
}

const CourtCaseList = ({ courtCases }: Props) => {
  return (
    <div>
      <p>{"Your cases are:"}</p>
      <div>
        {courtCases.map((courtCase, idx) => (
          <CourtCaseSummary courtCase={courtCase} key={idx}></CourtCaseSummary>
        ))}
      </div>
    </div>
  )
}

export default CourtCaseList
