import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/phase1/lib/errorPaths"
import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow, { ExceptionBadgeType as ExceptionBadge } from "components/ExceptionFieldTableRow"
import { OffenceMatcher } from "components/OffenceMatcher"
import { useCourtCase } from "context/CourtCaseContext"
import { Heading, Input, Table } from "govuk-react"
import { isEqual } from "lodash"
import { createUseStyles } from "react-jss"
import ErrorMessages, { findExceptions } from "types/ErrorMessages"
import { Exception } from "types/exceptions"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import { capitaliseExpression, getPleaStatus, getVerdict, getYesOrNo } from "utils/valueTransformers"
import { TableRow } from "../../TableRow"
import { HearingResult } from "./HearingResult"
import { OffenceNavigation } from "./OffenceNavigation"
import { StartDate } from "./StartDate"

interface OffenceDetailsProps {
  className: string
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceIndex: number
  exceptions: Exception[]
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

const getOffenceReasonSequencePath = (offenceIndex: number) => errorPaths.offence(offenceIndex).reasonSequence

type GetOffenceMatchingExceptionResult =
  | {
      code: ExceptionCode
      badge: ExceptionBadge.AddedByCourt | ExceptionBadge.Unmatched
    }
  | undefined
const getOffenceMatchingException = (
  exceptions: Exception[],
  offenceIndex: number
): GetOffenceMatchingExceptionResult => {
  const offenceMatchingException = exceptions.find((exception) => {
    const sequencePath = getOffenceReasonSequencePath(offenceIndex)

    const exceptionPath = exception.path.slice(exception.path.indexOf("HearingOutcome"))
    const hearingOutcomePath = sequencePath.slice(sequencePath.indexOf("HearingOutcome"))

    return (
      offenceMatchingExceptions.noOffencesMatched.includes(exception.code) ||
      (offenceMatchingExceptions.offenceNotMatched.includes(exception.code) &&
        isEqual(exceptionPath, hearingOutcomePath))
    )
  })

  if (!offenceMatchingException) {
    return undefined
  }

  return {
    code: offenceMatchingException.code,
    badge:
      offenceMatchingException.code === ExceptionCode.HO100507 ? ExceptionBadge.AddedByCourt : ExceptionBadge.Unmatched
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
  exceptions
}: OffenceDetailsProps) => {
  const { courtCase } = useCourtCase()
  const classes = useStyles()
  const offenceCode = getOffenceCode(offence)
  const qualifierCode =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Qualifier
  const isCaseUnresolved = courtCase.errorStatus === "Unresolved"
  const thisOffencePath = `AnnotatedHearingOutcome>HearingOutcome>Case>HearingDefendant>Offence>${
    selectedOffenceIndex - 1
  }`
  const thisResultPath = (resultIndex: number) => `${thisOffencePath}>Result>${resultIndex}`
  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, selectedOffenceIndex - 1)
  const offenceMatchingExceptionMessage = findExceptions(courtCase, courtCase.aho.Exceptions, ExceptionCode.HO100304)

  const unresolvedExceptionsOnThisOffence = !isCaseUnresolved
    ? []
    : exceptions.filter((exception) => exception.path.join(">").startsWith(thisOffencePath))

  const hasExceptionOnOffence = (exceptionCode: ExceptionCode) =>
    unresolvedExceptionsOnThisOffence.some((exception) => exception.code === exceptionCode)

  const offenceCodeErrorPrompt =
    (hasExceptionOnOffence("HO100251" as ExceptionCode) && ErrorMessages.HO100251ErrorPrompt) ||
    (hasExceptionOnOffence(ExceptionCode.HO100306) && ErrorMessages.HO100306ErrorPrompt)

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

  const displayOffenceMatcher =
    !!offenceMatchingException && exceptions.some((e) => [ExceptionCode.HO100310].includes(e.code))

  return (
    <div className={`${className} ${classes.wrapper}`}>
      <OffenceNavigation
        onBackToAllOffences={() => onBackToAllOffences()}
        selectedOffenceIndex={selectedOffenceIndex}
        onPreviousClick={() => onPreviousClick()}
        onNextClick={() => onNextClick()}
        offencesCount={offencesCount}
      />
      <Heading as="h3" size="MEDIUM">
        {`Offence ${selectedOffenceIndex} of ${offencesCount}`}
      </Heading>
      <div className="offences-table">
        <Table>
          {
            <>
              {offenceCodeErrorPrompt ? (
                <ExceptionFieldTableRow
                  badgeText={ExceptionBadge.SystemError}
                  value={offenceCode}
                  label={"Offence code"}
                >
                  <ErrorPromptMessage message={offenceCodeErrorPrompt} />
                </ExceptionFieldTableRow>
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

          {/* 
              If we don't display the exception matcher, 
              we should display the PNC sequence number
              input box below.
          */}
          {offenceMatchingException && displayOffenceMatcher && (
            <ExceptionFieldTableRow
              label={"Matched PNC offence"}
              value={<OffenceMatcher offenceIndex={selectedOffenceIndex} offence={offence} />}
            >
              <ErrorPromptMessage message={offenceMatchingExceptionMessage} />
            </ExceptionFieldTableRow>
          )}

          {/* PNC sequence number */}
          {offenceMatchingException ? (
            <ExceptionFieldTableRow
              badgeText={offenceMatchingException.badge}
              label={"PNC sequence number"}
              value={
                !displayOffenceMatcher && <Input type="text" maxLength={3} className={classes.pncSequenceNumber} />
              }
            >
              {" "}
              <>
                {"Court Case Reference:"}
                <br />
                {courtCase.courtReference}
              </>
            </ExceptionFieldTableRow>
          ) : (
            <TableRow
              label="PNC sequence number"
              value={
                <>
                  <div>{offence.CriminalProsecutionReference.OffenceReasonSequence}</div>
                  <Badge isRendered={true} colour={BadgeColours.Purple} label="Matched" />
                </>
              }
            />
          )}

          <TableRow label="Court offence sequence number" value={offence.CourtOffenceSequenceNumber} />
          <TableRow label="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
          <ConditionalRender isRendered={offence.Result.length > 0 && offence.Result[0].PleaStatus !== undefined}>
            <TableRow label="Plea" value={getPleaStatus(offence.Result[0].PleaStatus)} />
          </ConditionalRender>
          <ConditionalRender isRendered={offence.Result.length > 0 && offence.Result[0].Verdict !== undefined}>
            <TableRow label="Verdict" value={getVerdict(offence.Result[0].Verdict)} />
          </ConditionalRender>
        </Table>
      </div>

      <div className="offence-results-table">
        {offence.Result.map((result, index) => {
          return (
            <div key={result.CJSresultCode}>
              <Heading as="h4" size="MEDIUM">
                {"Hearing result"}
              </Heading>
              <HearingResult
                result={result}
                exceptions={unresolvedExceptionsOnThisOffence.filter((resultException) =>
                  resultException.path.join(">").startsWith(thisResultPath(index))
                )}
                selectedOffenceIndex={selectedOffenceIndex}
                resultIndex={index}
                errorStatus={courtCase.errorStatus}
              />
            </div>
          )
        })}
      </div>
      {qualifierCode && (
        <div className="qualifier-code-table">
          <Heading as="h4" size="MEDIUM">
            {"Qualifier"}
          </Heading>
          <Table>
            {qualifierErrorPrompt ? (
              <ExceptionFieldTableRow badgeText={ExceptionBadge.SystemError} value={qualifierCode} label={"Code"}>
                <ErrorPromptMessage message={qualifierErrorPrompt} />
              </ExceptionFieldTableRow>
            ) : (
              <TableRow label={"Code"} value={qualifierCode} />
            )}
          </Table>
        </div>
      )}
      <OffenceNavigation
        onBackToAllOffences={() => onBackToAllOffences()}
        selectedOffenceIndex={selectedOffenceIndex}
        onPreviousClick={() => onPreviousClick()}
        onNextClick={() => onNextClick()}
        offencesCount={offencesCount}
      />
    </div>
  )
}
