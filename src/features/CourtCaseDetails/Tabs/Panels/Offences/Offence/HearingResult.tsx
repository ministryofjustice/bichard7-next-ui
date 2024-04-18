import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import ConditionalRender from "components/ConditionalRender"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow, { ExceptionBadgeType } from "components/ExceptionFieldTableRow"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { Table } from "govuk-react"
import { findExceptions } from "types/ErrorMessages"
import { ResolutionStatus } from "types/ResolutionStatus"
import { Exception } from "types/exceptions"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import { formatDisplayedDate } from "utils/formattedDate"
import {
  capitaliseExpression,
  formatDuration,
  getNumberOfHours,
  getUrgentYesOrNo,
  getYesOrNo
} from "utils/valueTransformers"
import { TableRow } from "../../TableRow"
import { StyledTableRow } from "./HearingResult.styles"
import { NextHearingDateField } from "../../EditableFields/NextHearingDateField"

interface HearingResultProps {
  result: Result
  exceptions: Exception[]
  resultIndex: number
  selectedOffenceIndex: number
  errorStatus?: ResolutionStatus | null
}

export const HearingResult = ({
  result,
  errorStatus,
  exceptions,
  resultIndex,
  selectedOffenceIndex
}: HearingResultProps) => {
  const { courtCase, amendments } = useCourtCase()
  const cjsErrorMessage = findExceptions(courtCase, exceptions, ExceptionCode.HO100307)

  const offenceIndex = selectedOffenceIndex - 1
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)

  const isCaseEditable =
    courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME && errorStatus === "Unresolved"
  const text = result.ResultVariableText
  const formattedResult = text?.replace(/([^\d])\.([^\d\n])/g, "$1.\n\n$2")

  return (
    <Table>
      {cjsErrorMessage ? (
        <ExceptionFieldTableRow
          badgeText={ExceptionBadgeType.SystemError}
          value={result.CJSresultCode}
          label={"CJS Code"}
        >
          <ErrorPromptMessage message={cjsErrorMessage} />
        </ExceptionFieldTableRow>
      ) : (
        <TableRow label="CJS Code" value={result.CJSresultCode} />
      )}
      <TableRow
        label="Result hearing type"
        value={result.ResultHearingType && capitaliseExpression(result.ResultHearingType)}
      />
      <TableRow
        label="Result hearing date"
        value={result.ResultHearingDate && formatDisplayedDate(new Date(result.ResultHearingDate))}
      />
      <ConditionalRender isRendered={typeof result.Duration !== "undefined" && result.Duration?.length > 0}>
        <TableRow
          label="Duration"
          value={
            <>
              {result.Duration?.map((duration) => (
                <div key={`duration-${duration.DurationLength}-${duration.DurationUnit}`}>
                  {formatDuration(duration.DurationLength, duration.DurationUnit)}
                </div>
              ))}
            </>
          }
        />
      </ConditionalRender>
      <EditableFieldTableRow
        label="Next hearing location"
        hasExceptions={hasNextHearingLocationException(exceptions)}
        value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
        updatedValue={updatedNextHearingLocation}
        isEditable={isCaseEditable && hasNextHearingLocationException(exceptions)}
        inputLabel="Enter next hearing location"
        hintText="OU code, 6-7 characters"
      >
        <OrganisationUnitTypeahead
          value={
            amendedNextHearingLocation ??
            updatedNextHearingLocation ??
            result.NextResultSourceOrganisation?.OrganisationUnitCode
          }
          resultIndex={resultIndex}
          offenceIndex={offenceIndex}
        />
      </EditableFieldTableRow>
      <NextHearingDateField
        result={result}
        exceptions={exceptions}
        offenceIndex={offenceIndex}
        resultIndex={resultIndex}
        isCaseEditable={isCaseEditable}
      />
      <TableRow label="Mode of trial reason" value={result.ModeOfTrialReason} />
      <StyledTableRow label="Hearing result text" value={formattedResult} className={`result-text`} />{" "}
      <TableRow label="PNC disposal type" value={result.PNCDisposalType} />
      <TableRow label="Result class" value={result.ResultClass} />
      <TableRow label="PNC adjudication exists" value={getYesOrNo(result.PNCAdjudicationExists)} />
      <ConditionalRender isRendered={typeof result.Urgent !== "undefined"}>
        <TableRow label="Urgent" value={getUrgentYesOrNo(result.Urgent?.urgent)} />
        <TableRow label="Urgency" value={getNumberOfHours(result.Urgent?.urgency)} />
      </ConditionalRender>
    </Table>
  )
}
