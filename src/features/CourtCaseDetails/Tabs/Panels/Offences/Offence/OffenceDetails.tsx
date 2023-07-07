import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Heading, Table } from "govuk-react"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../../TableRow"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import { capitaliseExpression, getYesOrNo, HearingResult } from "./HearingResult"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { formatDisplayedDate } from "utils/formattedDate"
import { StartDate } from "./StartDate"

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
    let committedOnBailWithDescription = bailCode
    yesNo.forEach((answer) => {
      if (answer.cjsCode === bailCode) {
        committedOnBailWithDescription = `${bailCode} (${capitaliseExpression(answer.description)})`
      }
    })
    return committedOnBailWithDescription
  }

  const getFormattedSequenceNumber = (number: number) => {
    return number.toLocaleString("en-UK", { minimumIntegerDigits: 3 })
  }

  return (
    <>
      <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
      <Heading as="h3" size="MEDIUM">
        {`Offence ${offence.CourtOffenceSequenceNumber} of ${offencesCount}`}
      </Heading>
      <Table>
        <TableRow label="Offence code" value={getOffenceCode(offence)} />
        <TableRow label="Title" value={offence.OffenceTitle} />
        <TableRow label="Sequence number" value={getFormattedSequenceNumber(offence.CourtOffenceSequenceNumber)} />
        <TableRow label="Category" value={getOffenceCategory(offence.OffenceCategory)} />
        <TableRow label="Arrest date" value={offence.ArrestDate && formatDisplayedDate(new Date(offence.ArrestDate))} />
        <TableRow label="Charge date" value={offence.ChargeDate && formatDisplayedDate(new Date(offence.ChargeDate))} />
        <TableRow label="Start date" value={<StartDate offence={offence} />} />
        <TableRow label="Location" value={offence.LocationOfOffence} />
        <TableRow label="Wording" value={offence.ActualOffenceWording} />
        <TableRow label="Record on PNC" value={getYesOrNo(offence.RecordableOnPNCindicator)} />
        <TableRow label="Notifiable to Home Office" value={getYesOrNo(offence.NotifiableToHOindicator)} />
        <TableRow label="Home Office classification" value={offence.HomeOfficeClassification} />
        <TableRow
          label="Conviction date"
          value={offence.ConvictionDate && formatDisplayedDate(new Date(offence.ConvictionDate))}
        />
        <TableRow label="Court Offence Sequence Number" value={offence.CourtOffenceSequenceNumber} />
        <TableRow label="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
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
        <TableRow label="Code" value={"TODO"} />
      </Table>
      <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
    </>
  )
}
