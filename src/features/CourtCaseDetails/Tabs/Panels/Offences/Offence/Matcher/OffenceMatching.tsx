import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Exception } from "types/exceptions"
import getExceptionMessage from "utils/offenceMatcher/getExceptionMessage"
import getOffenceMatchingException from "utils/offenceMatcher/getOffenceMatchingException"
import isEnabled from "utils/offenceMatcher/isEnabled"
import offenceMatchingExceptions from "utils/offenceMatcher/offenceMatchingExceptions"

import LegacySequencingBadgeTableRow from "./TableRows/LegacySequencingBadgeTableRow"
import LegacySequencingMessageTableRow from "./TableRows/LegacySequencingMessageTableRow"
import OffenceMatcherTableRow from "./TableRows/OffenceMatcherTableRow"
import OffenceMatchingBadgeTableRow from "./TableRows/OffenceMatchingBadgeTableRow"

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
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, offenceIndex)
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  const displayOffenceMatcher =
    isEnabled(currentUser) && exceptions.some((e) => offenceMatchingExceptions.offenceNotMatched.includes(e.code))
  const userCanMatchOffence =
    courtCase.errorLockedByUsername === currentUser?.username && courtCase.errorStatus === "Unresolved"

  return (
    <>
      {/* If we don't display the exception matcher,
      we should display the PNC sequence number input box below. */}
      <ConditionalRender isRendered={displayOffenceMatcher}>
        {offenceMatchingException && userCanMatchOffence ? (
          <OffenceMatcherTableRow offenceIndex={offenceIndex} isCaseLockedToCurrentUser={isCaseLockedToCurrentUser} />
        ) : (
          <OffenceMatchingBadgeTableRow
            offenceIndex={offenceIndex}
            offenceReasonSequence={offence.CriminalProsecutionReference.OffenceReasonSequence}
          />
        )}
      </ConditionalRender>

      {/* PNC sequence number */}
      <ConditionalRender isRendered={!displayOffenceMatcher}>
        {offenceMatchingException ? (
          <LegacySequencingMessageTableRow
            exception={offenceMatchingException}
            message={offenceMatchingExceptionMessage}
          />
        ) : (
          <LegacySequencingBadgeTableRow
            offenceReasonSequence={offence.CriminalProsecutionReference.OffenceReasonSequence}
          />
        )}
      </ConditionalRender>
    </>
  )
}
