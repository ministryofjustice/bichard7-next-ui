import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Heading, Table } from "govuk-react"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../../TableRow"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import { getYesOrNo, HearingResult } from "./HearingResult"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { formatDisplayedDate } from "utils/formattedDate"

interface OffenceDetailsProps {
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
}

export const OffenceDetails = ({ offence, offencesCount, onBackToAllOffences }: OffenceDetailsProps) => {
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

  const getFormattedSequenceNumber = (number: number) => {
    return number.toLocaleString("en-UK", { minimumIntegerDigits: 3 })
  }

  return (
    <>
      <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
      <Heading as="h4" size="MEDIUM">
        {`Offence ${offence.CourtOffenceSequenceNumber} of ${offencesCount}`}
      </Heading>
      <Table>
        <TableRow header="Offence code" value={getOffenceCode(offence)} />
        <TableRow header="Title" value={offence.OffenceTitle} />
        <TableRow header="Sequence number" value={getFormattedSequenceNumber(offence.CourtOffenceSequenceNumber)} />
        <TableRow header="Category" value={getOffenceCategory(offence.OffenceCategory)} />
        <TableRow
          header="Arrest date"
          value={offence.ArrestDate && formatDisplayedDate(new Date(offence.ArrestDate))}
        />
        <TableRow
          header="Charge date"
          value={offence.ChargeDate && formatDisplayedDate(new Date(offence.ChargeDate))}
        />
        <TableRow header="Date code" value={`${offence.ActualOffenceDateCode} (on or in)`} />
        <TableRow
          header="Start date"
          value={
            offence.ActualOffenceStartDate.StartDate &&
            formatDisplayedDate(new Date(offence.ActualOffenceStartDate.StartDate))
          }
        />
        <TableRow header="Location" value={offence.LocationOfOffence} />
        <TableRow header="Wording" value={offence.ActualOffenceWording} />
        <TableRow header="Record on PNC" value={getYesOrNo(offence.RecordableOnPNCindicator)} />
        <TableRow header="Notifiable to Home Office" value={getYesOrNo(offence.NotifiableToHOindicator)} />
        <TableRow header="Home Office classification" value={offence.HomeOfficeClassification} />
        <TableRow
          header="Conviction date"
          value={offence.ConvictionDate && formatDisplayedDate(new Date(offence.ConvictionDate))}
        />
        <TableRow header="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow header="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow header="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
      </Table>
      <Heading as="h4" size="MEDIUM">
        {"Hearing result"}
      </Heading>
      {offence.Result.map((result, index) => {
        return <HearingResult result={result} key={index} />
      })}
      <Heading as="h4" size="MEDIUM">
        {"Qualifier"}
      </Heading>
      <Table>
        <TableRow header="Code" value={"TO DO"} />
      </Table>
      <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
    </>
  )
}
