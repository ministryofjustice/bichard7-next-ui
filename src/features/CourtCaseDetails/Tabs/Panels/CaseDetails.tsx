import { Case } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { TableRow } from "./TableRow"
import { Table } from "govuk-react"
import { forces } from "@moj-bichard7-developers/bichard7-next-data"

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

  // TODO extract force owner => string into a helper function and unit test
  if (caseDetails.ForceOwner !== undefined) {
    const forceName = forces.find((force) => force.code === caseDetails.ForceOwner?.SecondLevelCode)?.name
    rows.push({
      label: "Force owner",
      value: `${forceName ? forceName + " " : ""}${caseDetails.ForceOwner.OrganisationUnitCode}`
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
