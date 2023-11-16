import type {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import SecondaryButton from "components/SecondaryButton"
import UneditableField from "components/UneditableField"
import { GridCol, GridRow, Heading, Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import ErrorMessages from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../../TableRow"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { HearingResult, capitaliseExpression, getYesOrNo } from "./HearingResult"
import { StartDate } from "./StartDate"
import { DisplayFullCourtCase } from "types/display/CourtCases"

interface OffenceDetailsProps {
  className: string
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceIndex: number
  exceptions: { code: ExceptionCode; path: (string | number)[] }[]
  courtCase: DisplayFullCourtCase
  pncQuery?: AnnotatedHearingOutcome["PncQuery"]
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
  exceptions,
  courtCase,
  pncQuery
}: OffenceDetailsProps) => {
  const classes = useStyles()
  const offenceCode = getOffenceCode(offence)
  const pncSequenceNumber = pncQuery?.courtCases?.[0]?.offences?.find((o) => o.offence.cjsOffenceCode === offenceCode)
    ?.offence?.sequenceNumber
  const qualifierCode =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Qualifier

  const findUnresolvedException = (exceptionCode: ExceptionCode) =>
    exceptions.find(
      (exception) => exception.code === exceptionCode && exception.path[5] === selectedOffenceIndex - 1
    ) && courtCase.errorStatus !== "Resolved"

  const offenceCodeErrorPrompt = findUnresolvedException("HO100251" as ExceptionCode)
    ? ErrorMessages.HO100251ErrorPrompt
    : findUnresolvedException(ExceptionCode.HO100306)
      ? ErrorMessages.HO100306ErrorPrompt
      : undefined

  const qualifierErrorPrompt = findUnresolvedException(ExceptionCode.HO100309) && ErrorMessages.QualifierCode

  let offenceCategoryWithDescription = offence.OffenceCategory
  offenceCategory.forEach((category) => {
    if (category.cjsCode === offence.OffenceCategory) {
      offenceCategoryWithDescription = `${offence.OffenceCategory} (${category.description.toLowerCase()})`
    }
  })

  const getCommittedOnBail = (bailCode: string) => {
    let committedOnBailWithDescription = bailCode
    yesNo.forEach((answer) => {
      if (answer.cjsCode === bailCode) {
        committedOnBailWithDescription = `${bailCode} (${capitaliseExpression(answer.description)})`
      }
    })
    return committedOnBailWithDescription
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
        {`Offence ${selectedOffenceIndex} of ${offencesCount}`}
      </Heading>
      <Table>
        <div className="offences-table">
          {
            <>
              {offenceCodeErrorPrompt ? (
                <UneditableField
                  badge={"SYSTEM ERROR"}
                  colour={"purple"}
                  message={offenceCodeErrorPrompt}
                  code={offenceCode}
                  label={"Offence code"}
                />
              ) : (
                <TableRow label="Offence code" value={offenceCode} />
              )}
            </>
          }
          <TableRow label="Title" value={offence.OffenceTitle} />
          <TableRow label="Category" value={offenceCategoryWithDescription} />
          <TableRow
            label="Arrest date"
            value={offence.ArrestDate && formatDisplayedDate(new Date(offence.ArrestDate))}
          />
          <TableRow
            label="Charge date"
            value={offence.ChargeDate && formatDisplayedDate(new Date(offence.ChargeDate))}
          />
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
          <TableRow label="PNC sequence number" value={pncSequenceNumber?.toString().padStart(3, "0")} />
          <TableRow label="Court offence sequence number" value={offence.CourtOffenceSequenceNumber} />
          <TableRow label="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
        </div>
      </Table>
      <Heading as="h4" size="MEDIUM">
        {"Hearing result"}
      </Heading>
      {offence.Result.map((result, index) => {
        return <HearingResult result={result} key={index} />
      })}

      {qualifierCode && (
        <>
          <div className="qualifier-code-table">
            <Heading as="h4" size="MEDIUM">
              {"Qualifier"}
            </Heading>
            <Table>
              {qualifierErrorPrompt ? (
                <UneditableField
                  badge={"SYSTEM ERROR"}
                  colour={"purple"}
                  message={qualifierErrorPrompt}
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
