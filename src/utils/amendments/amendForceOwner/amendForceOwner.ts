import {
  AnnotatedHearingOutcome,
  OrganisationUnitCodes
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createForceOwner from "utils/createForceOwner"

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_STATION_CODE = "YZ"

const amendForceOwner = (updatedValue: string, aho: AnnotatedHearingOutcome) => {
  const upperCaseUpdatedValue = updatedValue.trim().toUpperCase().substring(0, 2)
  if (!aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner) {
    const forceOwner = createForceOwner(`${upperCaseUpdatedValue}${DEFAULT_STATION_CODE}`)

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      ...(forceOwner as OrganisationUnitCodes)
    }
  } else {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.OrganisationUnitCode = `${upperCaseUpdatedValue}${DEFAULT_STATION_CODE}00`
  }

  if (!aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner) {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner = true
  }
}

export default amendForceOwner
