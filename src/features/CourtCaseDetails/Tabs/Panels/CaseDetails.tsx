import { Case } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { TableRow } from "./TableRow"
import { Table } from "govuk-react"
import formatForce from "utils/formatForce"

interface caseDetailsProps {
  caseDetails: Case
}

type Row = {
  label: string
  value: string
}

export const CaseDetails = ({ caseDetails }: caseDetailsProps) => {
  const rows: Row[] = [
    {
      label: "PTIURN",
      value: caseDetails.PTIURN
    }
  ]

  console.log(caseDetails.ForceOwner)

  if (caseDetails.ForceOwner !== undefined) {
    rows.push({
      label: "Force owner",
      value: formatForce(caseDetails.ForceOwner)
    })
  }

  return (
    <Table>
      {rows.map((row, idx) => (
        <TableRow label={row.label} value={row.value} key={idx} />
      ))}
    </Table>
  )
}
