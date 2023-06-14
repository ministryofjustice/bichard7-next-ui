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

  if (caseDetails.CourtCaseReferenceNumber !== undefined) {
    rows.push({
      label: "Court case reference",
      value: caseDetails.CourtCaseReferenceNumber
    })
  }

  if (caseDetails.CourtReference.CrownCourtReference !== undefined) {
    rows.push(
      { label: "Crown court reference", value: caseDetails.CourtReference.CrownCourtReference },
      { label: "Magistrates court reference", value: caseDetails.CourtReference.MagistratesCourtReference }
    )
  } else {
    rows.push({
      label: "Court reference",
      value: caseDetails.CourtReference.MagistratesCourtReference
    })
  }

  if (caseDetails.RecordableOnPNCindicator !== undefined) {
    rows.push({
      label: "Notifiable to PNC",
      value: caseDetails.RecordableOnPNCindicator ? "Yes" : "No"
    })
  }

  rows.push({
    label: "Pre decision ind",
    value: caseDetails.PreChargeDecisionIndicator ? "Yes" : "No"
  })

  return (
    <Table>
      {rows.map((row, idx) => (
        <TableRow label={row.label} value={row.value} key={idx} />
      ))}
    </Table>
  )
}
