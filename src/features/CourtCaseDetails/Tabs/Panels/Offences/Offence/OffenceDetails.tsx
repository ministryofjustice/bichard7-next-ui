import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow, { ExceptionBadgeType as ExceptionBadge } from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Heading, Table } from "govuk-react"
import ErrorMessages from "types/ErrorMessages"
import { Exception } from "types/exceptions"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import { capitaliseExpression, getPleaStatus, getVerdict, getYesOrNo } from "utils/valueTransformers"
import { TableRow } from "../../TableRow"
import { HearingResult } from "./HearingResult"
import { OffenceDetailsContainer } from "./OffenceDetails.styles"
import { OffenceMatching } from "./OffenceMatching"
import { OffenceNavigation } from "./OffenceNavigation"
import { StartDate } from "./StartDate"

interface OffenceDetailsProps {
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceIndex: number
  exceptions: Exception[]
  stopLeavingFn: (newValue: boolean) => void
}

export const OffenceDetails = ({
  offence,
  offencesCount,
  onBackToAllOffences,
  onNextClick,
  onPreviousClick,
  selectedOffenceIndex,
  exceptions,
  stopLeavingFn
}: OffenceDetailsProps) => {
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceCode = getOffenceCode(offence)
  const qualifierCode =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Qualifier

  const isCaseUnresolved = courtCase.errorStatus === "Unresolved"

  const isCaseLockedToCurrentUser = currentUser.username === courtCase.errorLockedByUsername

  const thisOffencePath = `AnnotatedHearingOutcome>HearingOutcome>Case>HearingDefendant>Offence>${
    selectedOffenceIndex - 1
  }`
  const thisResultPath = (resultIndex: number) => `${thisOffencePath}>Result>${resultIndex}`

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

  return (
    <OffenceDetailsContainer className={"offence-details"}>
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

          <OffenceMatching
            selectedOffenceIndex={selectedOffenceIndex}
            offence={offence}
            isCaseUnresolved={isCaseUnresolved}
            exceptions={exceptions}
            state={isCaseLockedToCurrentUser}
          ></OffenceMatching>

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
                stopLeavingFn={stopLeavingFn}
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
    </OffenceDetailsContainer>
  )
}
