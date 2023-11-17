import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import SecondaryButton from "components/SecondaryButton"
import { GridCol, GridRow, Heading, Input, Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import ErrorMessages from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import { TableRow } from "../../TableRow"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { HearingResult, capitaliseExpression, getYesOrNo } from "./HearingResult"
import { StartDate } from "./StartDate"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/phase1/lib/errorPaths"
import { isEqual } from "lodash"
import Badge from "../../../../../../components/Badge"
import ExceptionPromptTableRow from "../../../../../../components/ExceptionPromptTableRow"

type Exception = { code: ExceptionCode; path: (string | number)[] }
interface OffenceDetailsProps {
  className: string
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceIndex: number
  exceptions: Exception[]
  courtCase: DisplayFullCourtCase
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
  },

  pncSequenceNumber: {
    width: "4.125rem"
  }
})

const offenceMatchingExceptions = {
  noOffencesMatched: [ExceptionCode.HO100304, ExceptionCode.HO100328, ExceptionCode.HO100507],
  offenceNotMatched: [
    ExceptionCode.HO100203,
    ExceptionCode.HO100228,
    ExceptionCode.HO100310,
    ExceptionCode.HO100311,
    ExceptionCode.HO100312,
    ExceptionCode.HO100320,
    ExceptionCode.HO100329,
    ExceptionCode.HO100332,
    ExceptionCode.HO100333
  ]
}

const getOffenceMatchingException = (exceptions: Exception[], offenceIndex: number) => {
  const offenceMatchingException = exceptions.find(
    (exception) =>
      offenceMatchingExceptions.noOffencesMatched.includes(exception.code) ||
      (offenceMatchingExceptions.offenceNotMatched.includes(exception.code) &&
        isEqual(exception.path, errorPaths.offence(offenceIndex).reasonSequence))
  )

  if (!offenceMatchingException) {
    return undefined
  }

  return {
    code: offenceMatchingException.code,
    badge: offenceMatchingException.code === ExceptionCode.HO100507 ? "Added by Court" : "Unmatched"
  }
}

export const OffenceDetails = ({
  className,
  offence,
  offencesCount,
  onBackToAllOffences,
  onNextClick,
  onPreviousClick,
  selectedOffenceIndex,
  exceptions,
  courtCase
}: OffenceDetailsProps) => {
  const classes = useStyles()
  const offenceCode = getOffenceCode(offence)
  const qualifierCode =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Qualifier
  const isCaseUnresolved = courtCase.errorStatus !== "Resolved"
  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, selectedOffenceIndex - 1)

  const offenceCodeReason =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Reason

  const hasExceptionOnOffence = (exceptionCode: ExceptionCode) =>
    isCaseUnresolved &&
    exceptions.some(
      (exception) =>
        exception.code === exceptionCode &&
        exception.path
          .join(">")
          .startsWith(
            `AnnotatedHearingOutcome>HearingOutcome>Case>HearingDefendant>Offence>${selectedOffenceIndex - 1}`
          )
    )

  const offenceCodeErrorPrompt =
    (hasExceptionOnOffence(ExceptionCode.HO100306) && ErrorMessages.HO100306ErrorPrompt) ||
    (hasExceptionOnOffence("HO100251" as ExceptionCode) && ErrorMessages.HO100251ErrorPrompt)

  const qualifierErrorPrompt = hasExceptionOnOffence(ExceptionCode.HO100309) && ErrorMessages.QualifierCode

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
                <ExceptionPromptTableRow
                  badgeText={"SYSTEM ERROR"}
                  badgeColour="purple"
                  message={offenceCodeErrorPrompt}
                  value={offenceCode}
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
          {offenceMatchingException ? (
            <ExceptionPromptTableRow
              badgeText={offenceMatchingException.badge}
              badgeColour="purple"
              message={
                <>
                  {"Court Case Reference:"}
                  <br />
                  {courtCase.courtReference}
                </>
              }
              label={"PNC sequence number"}
              value={<Input type="text" maxLength={3} className={classes.pncSequenceNumber} />}
            />
          ) : (
            <TableRow
              label="PNC sequence number"
              value={
                <>
                  <div>{offence.CriminalProsecutionReference.OffenceReasonSequence}</div>
                  <Badge isRendered={true} colour="purple" label="Matched" />
                </>
              }
            />
          )}
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
                <ExceptionPromptTableRow
                  badgeText={"SYSTEM ERROR"}
                  badgeColour="purple"
                  message={qualifierErrorPrompt}
                  value={qualifierCode}
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
