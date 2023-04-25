import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/build/src/serialise/ahoXml/generate"
import Phase from "@moj-bichard7-developers/bichard7-next-core/build/src/types/Phase"
import updateCourtCaseAho from "services/updateCourtCaseAho"
import { DataSource, EntityManager } from "typeorm"
import { Amendments } from "types/Amendments"
import { isError } from "types/Result"
import createForceOwner from "utils/createForceOwner"
import applyAmendmentsToAho from "./applyAmendmentsToAho"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import type User from "../entities/User"
import insertNotes from "services/insertNotes"
import getSystemNotes from "utils/amendments/getSystemNotes"
import getCourtCaseByVisibleForce from "services/getCourtCaseByVisibleForce"

const amendCourtCase = async (
  dataSource: DataSource | EntityManager,
  amendments: Partial<Amendments>,
  courtCaseId: number,
  userDetails: User
): Promise<AnnotatedHearingOutcome | Error> => {
  const courtCaseRow = await getCourtCaseByVisibleForce(dataSource, courtCaseId, userDetails.visibleForces)

  if (isError(courtCaseRow)) {
    return courtCaseRow
  }

  if (!courtCaseRow) {
    return new Error("Failed to get court case")
  }

  if (
    (courtCaseRow.errorLockedByUsername && courtCaseRow.errorLockedByUsername != userDetails.username) ||
    (courtCaseRow.triggerLockedByUsername && courtCaseRow.triggerLockedByUsername != userDetails.username)
  ) {
    return new Error("Court case is locked by another user")
  }

  // we need to parse the annotated message due to being xml in db
  const aho = parseAhoXml(courtCaseRow.updatedHearingOutcome ?? courtCaseRow.hearingOutcome)

  if (isError(aho)) {
    return aho
  }

  const ahoForceOwner = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner
  if (ahoForceOwner === undefined || !ahoForceOwner.OrganisationUnitCode) {
    const organisationUnitCodes = createForceOwner(courtCaseRow.orgForPoliceFilter || "")

    if (isError(organisationUnitCodes)) {
      return organisationUnitCodes
    }
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = organisationUnitCodes
  }
  const updatedAho = applyAmendmentsToAho(amendments, aho)

  if (isError(updatedAho)) {
    return updatedAho
  }

  const generatedXml = convertAhoToXml(updatedAho, false)

  // Depending on the phase, treat the update as either hoUpdate or pncUpdate
  if (courtCaseRow.phase === Phase.HEARING_OUTCOME) {
    if (courtCaseRow.errorLockedByUsername === userDetails.username || courtCaseRow.errorLockedByUsername === null) {
      const updateResult = await updateCourtCaseAho(
        dataSource,
        courtCaseId,
        generatedXml,
        !amendments.noUpdatesResubmit
      )

      if (isError(updateResult)) {
        return updateResult
      }

      const addNoteResult = await insertNotes(dataSource, getSystemNotes(amendments, userDetails, courtCaseId))

      if (isError(addNoteResult)) {
        return addNoteResult
      }
    }
  } else {
    // TODO: Cover PNC update phase
  }

  return updatedAho
}

export default amendCourtCase
