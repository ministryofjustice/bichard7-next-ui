import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Exception } from "types/exceptions"
import getExceptionMessage from "utils/offenceMatcher/getExceptionMessage"
import { getOffenceMatchingException } from "utils/offenceMatcher/getOffenceMatchingException"
import isEnabled from "utils/offenceMatcher/isEnabled"
import offenceMatchingExceptions from "utils/offenceMatcher/offenceMatchingExceptions"
import findCandidates from "../../../../../../utils/offenceMatcher/findCandidates"
import { TableRow } from "../../TableRow"
import OffenceMatcher from "./OffenceMatcher"

type OffenceMatchingProps = {
  offenceIndex: number
  offence: Offence
  isCaseUnresolved: boolean
  exceptions: Exception[]
  isCaseLockedToCurrentUser: boolean
}

export const OffenceMatching = ({
  offenceIndex,
  offence,
  isCaseUnresolved,
  exceptions,
  isCaseLockedToCurrentUser
}: OffenceMatchingProps) => {
  const { courtCase, savedAmendments } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, offenceIndex)
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  const displayOffenceMatcher =
    isEnabled(currentUser) && exceptions.some((e) => offenceMatchingExceptions.offenceNotMatched.includes(e.code))
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
            value={
              <OffenceMatcher
                offenceIndex={offenceIndex}
                candidates={findCandidates(courtCase, offenceIndex)}
                isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
              />
            }
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
            message={offenceMatchingExceptionMessage}
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
