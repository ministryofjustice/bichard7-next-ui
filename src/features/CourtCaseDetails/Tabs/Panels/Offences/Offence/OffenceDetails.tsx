import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import ErrorMessages from "Data/ErrorMessages"
import SecondaryButton from "components/SecondaryButton"
import UneditableField from "components/UneditableField"
import { GridCol, GridRow, Heading, Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../../TableRow"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { HearingResult, capitaliseExpression, getYesOrNo } from "./HearingResult"
import { StartDate } from "./StartDate"

interface OffenceDetailsProps {
  className: string
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceIndex: number
  exceptions: ExceptionCode[]
}
const useStyles = createUseStyles({
  button: {
    textAlign: "right"
  },

  nextButton: {
    marginLeft: "30px"
  },

  wrapper: {
    "& td": {
      width: "50%"
    }
  }
})

export const OffenceDetails = ({
  className,
  offence,
  offencesCount,
  onBackToAllOffences,
  onNextClick,
  onPreviousClick,
  selectedOffenceIndex,
  exceptions
}: OffenceDetailsProps) => {
  const classes = useStyles()
  const qualifierCode =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Qualifier
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
    <div className={`${className} ${classes.wrapper}`}>
      <GridRow>
        <GridCol>
          <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
        </GridCol>
        <GridCol className={classes.button}>
          {selectedOffenceIndex !== 1 && (
            <SecondaryButton onClick={() => onPreviousClick()}>{"Previous offence"}</SecondaryButton>
          )}
          {selectedOffenceIndex !== offencesCount && (
            <SecondaryButton className={classes.nextButton} onClick={() => onNextClick()}>
              {"Next offence"}
            </SecondaryButton>
          )}
        </GridCol>
      </GridRow>
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

      {qualifierCode && (
        <>
          <div className="qualifierCodeTable">
            <Heading as="h4" size="MEDIUM">
              {"Qualifier"}
            </Heading>
            <Table>
              {exceptions.includes(ExceptionCode.HO100309) ? (
                <UneditableField
                  badge={"SYSTEM ERROR"}
                  colour={"purple"}
                  message={ErrorMessages.QualifierCode}
                  code={qualifierCode}
                  label={"Code"}
                />
              ) : (
                <TableRow label={"Code"} value={qualifierCode} />
              )}
            </Table>
          </div>
        </>
      )}
      <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
    </div>
  )
}
