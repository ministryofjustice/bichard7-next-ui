import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { OffenceMatcher } from "components/OffenceMatcher"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { findExceptions } from "types/ErrorMessages"
import { DisplayFullUser } from "types/display/Users"
import { Exception } from "types/exceptions"
import { getOffenceMatchingException } from "utils/exceptions/getOffenceMatchingException"
import { TableRow } from "../../TableRow"
import { PncInput } from "./OffenceDetails.styles"

const enabled = (user: DisplayFullUser) => {
  const enabledInProduction = true // change this if we need to disable in production for everyone
  const { exceptionsEnabled, offenceMatchingEnabled } = user.featureFlags
  const featureFlagsEnabled = exceptionsEnabled && offenceMatchingEnabled

  const isProduction = process.env.WORKSPACE === "production"
  if (!isProduction) {
    return featureFlagsEnabled
  }
  return enabledInProduction && featureFlagsEnabled
}

type Props = {
  offenceIndex: number
  offence: Offence
  isCaseUnresolved: boolean
  exceptions: Exception[]
  state: boolean
}

export const OffenceMatching = ({ offenceIndex, offence, isCaseUnresolved, exceptions, state }: Props) => {
  const { courtCase, savedAmendments } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, offenceIndex)
  const offenceMatchingExceptionMessage = findExceptions(courtCase, courtCase.aho.Exceptions, ExceptionCode.HO100304)

  const displayOffenceMatcher =
    enabled(currentUser) && exceptions.some((e) => [ExceptionCode.HO100310].includes(e.code))
  const userCanMatchOffence =
    courtCase.errorLockedByUsername === currentUser?.username && courtCase.errorStatus === "Unresolved"

  const updatedOffence = savedAmendments.offenceReasonSequence?.find((o) => o.offenceIndex === offenceIndex)
  return (
    <>
      {/* If we don't display the exception matcher, 
      we should display the PNC sequence number input box below. */}
      <ConditionalRender isRendered={displayOffenceMatcher}>
        {offenceMatchingException && userCanMatchOffence ? (
          <ExceptionFieldTableRow
            label={"Matched PNC offence"}
            value={<OffenceMatcher offenceIndex={offenceIndex} offence={offence} state={state} />}
          >
            <ErrorPromptMessage message={offenceMatchingExceptionMessage} />
          </ExceptionFieldTableRow>
        ) : (
          <TableRow
            label="Matched PNC offence"
            value={
              <>
                <div>{offence.CriminalProsecutionReference.OffenceReasonSequence}</div>
                <Badge
                  isRendered={true}
                  colour={BadgeColours.Purple}
                  label={!updatedOffence ? "UNMATCHED" : updatedOffence.value === 0 ? "ADDED IN COURT" : "MATCHED"}
                  className="moj-badge--large"
                />
              </>
            }
          />
        )}
      </ConditionalRender>

      {/* PNC sequence number */}
      <ConditionalRender isRendered={!displayOffenceMatcher}>
        {offenceMatchingException ? (
          <ExceptionFieldTableRow
            badgeText={offenceMatchingException.badge}
            label={"PNC sequence number"}
            value={<PncInput type="text" maxLength={3} className={"pnc-sequence-number"} />}
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
                <Badge isRendered={true} colour={BadgeColours.Purple} label="Matched" className="moj-badge--large" />
              </>
            }
          />
        )}
      </ConditionalRender>
    </>
  )
}
