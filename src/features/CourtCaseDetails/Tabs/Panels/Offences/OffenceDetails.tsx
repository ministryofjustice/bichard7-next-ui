import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Heading, Table } from "govuk-react"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../TableRow"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"

interface OffenceDetailsProps {
  offence: Offence
  offencesCount: number
}

export const OffenceDetails = ({ offence, offencesCount }: OffenceDetailsProps) => {
  const getOffenceCategory = (offenceCode: string | undefined) => {
    let offenceCategoryWithDescription = offenceCode
    offenceCategory.forEach((category) => {
      if (category.cjsCode === offenceCode) {
        offenceCategoryWithDescription = `${offenceCode} (${category.description.toLowerCase()})`
      }
    })
    return offenceCategoryWithDescription
  }

  const getCommittedOnBail = (bailCode: string) => {
    let CommittedOnBailWithDescription = bailCode
    yesNo.forEach((answer) => {
      if (answer.cjsCode === bailCode) {
        CommittedOnBailWithDescription = `${bailCode} (${answer.description})`
      }
    })
    return CommittedOnBailWithDescription
  }

  const getYesOrNo = (code: boolean | undefined) => {
    return code === true ? "Y" : code === false ? "N" : undefined
  }

  return (
    <>
      <Heading as="h4" size="MEDIUM">
        {`Offence x of ${offencesCount}`}
      </Heading>
      <Table>
        <TableRow header="Offence code" value={getOffenceCode(offence)} />
        <TableRow header="Title" value={offence.OffenceTitle} />
        <TableRow header="Sequence number" value={"TO DO"} />
        <TableRow header="Category" value={getOffenceCategory(offence.OffenceCategory)} />
        <TableRow header="Arrest date" value={offence.ChargeDate?.toString()} />
        <TableRow header="Charge date" value={offence.ChargeDate?.toString()} />
        <TableRow header="Date code" value={offence.ActualOffenceDateCode} />
        <TableRow header="Start date" value={offence.ActualOffenceStartDate?.StartDate?.toString()} />
        <TableRow header="Location" value={offence.LocationOfOffence} />
        <TableRow header="Wording" value={offence.ActualOffenceWording} />
        <TableRow header="Record on PNC" value={getYesOrNo(offence.RecordableOnPNCindicator)} />
        <TableRow header="Notifiable to Home Office" value={getYesOrNo(offence.NotifiableToHOindicator)} />
        <TableRow header="Home Office classification" value={offence.HomeOfficeClassification} />
        <TableRow header="Conviction date" value={offence.ConvictionDate?.toString()} />
        <TableRow header="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow header="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow header="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
      </Table>
      <Heading as="h4" size="MEDIUM">
        {"Hearing result"}
      </Heading>
      {offence.Result.map((result, index) => {
        return (
          <Table key={index}>
            <TableRow header="CJS Code" value={result.CJSresultCode} />
            <TableRow header="Result hearing type" value={result.ResultHearingType} />
            <TableRow header="Result hearing date" value={result.ResultHearingDate?.toString()} />
            <TableRow header="Next hearing location" value={"TO DO"} />
            <TableRow
              header="Next hearing date"
              value={result.NextHearingDate ? result.NextHearingDate.toString() : "Not entered"}
            />
            <TableRow header="Plea" value={result.PleaStatus} />
            <TableRow header="Verdict" value={result.Verdict} />
            <TableRow header="Mode of trail reason" value={result.ModeOfTrialReason} />
            <TableRow header="Text" value={result.ResultVariableText} />
            <TableRow header="PNC disposal type" value={result.PNCDisposalType} />
            <TableRow header="Result class" value={result.ResultClass} />
            <TableRow header="PNC adjudication exists" value={getYesOrNo(result.PNCAdjudicationExists)} />
          </Table>
        )
      })}
      <Heading as="h4" size="MEDIUM">
        {"Qualifier"}
      </Heading>
      <Table>
        <TableRow header="Code" value={"TO DO"} />
      </Table>
    </>
  )
}
