import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/build/src/serialise/ahoXml/generate"
import Phase from "@moj-bichard7-developers/bichard7-next-core/build/src/types/Phase"
import getCourtCase from "../../services/getCourtCase"
import updateCourtCaseUpdatedHo from "services/updateCourtCaseUpdatedHo"
import { DataSource } from "typeorm"
import { Amendments } from "types/Amendments"
import { isError } from "types/Result"
import createForceOwner from "utils/createForceOwner"
import applyAmendmentsToAho from "./applyAmendmentsToAho"

import type User from "../entities/User"

const amendCourtCase = async (
  amendments: Partial<Amendments>,
  courtCaseId: number,
  userDetails: User,
  dataSource: DataSource
) => {
  // database call to retrieve the current court case
  // Check current court case exception and triggers are locked by current user
  const courtCaseRow = await getCourtCase(dataSource, courtCaseId)

  if (isError(courtCaseRow)) {
    return courtCaseRow
  }

  if (!courtCaseRow) {
    return new Error("Failed to get court case")
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
  const updatedAho = applyAmendmentsToAho(amendments, aho) // this fn returns the aho

  const generatedXml = convertAhoToXml(aho)
  // Depending on the phase, treat the update as either hoUpdate or pncUpdate
  if (courtCaseRow.phase === Phase.HEARING_OUTCOME) {
    if (!amendments.noUpdatesResubmit || ahoForceOwner === undefined) {
      if (courtCaseRow.errorLockedByUsername === userDetails.username || courtCaseRow.errorLockedByUsername === null) {
        const updateResult = await updateCourtCaseUpdatedHo(dataSource, courtCaseId, generatedXml)
        if (isError(updateResult)) {
          return updateResult
        }
      }
    }
  } else {
    // TODO: Cover PNC update phase
  }

  // TODO: Set the status on the record -- see ScreenFlowImpl.java -> submitResolvedError -> line 872
  return updatedAho
}

export default amendCourtCase
