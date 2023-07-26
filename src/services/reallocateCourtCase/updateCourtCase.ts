import { EntityManager } from "typeorm"
import { isError } from "../../types/Result"
import CourtCase from "../entities/CourtCase"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import TriggerOutcome from "../../types/TriggerOutcome"
import Trigger from "../entities/Trigger"

const updateCourtCase = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  aho: AnnotatedHearingOutcome,
  addedTriggers: TriggerOutcome[],
  deletedTriggers: TriggerOutcome[]
): Promise<Pick<CourtCase, "orgForPoliceFilter"> | Error> => {
  const triggerTimestamp = new Date()
  const triggers = await entityManager
    .getRepository(Trigger)
    .findBy({ errorId: courtCase.errorId })
    .catch((error) => error as Error)

  if (isError(triggers)) {
    throw triggers
  }

  const asnSize = 21
  const ptiurnSize = 11
  const { SecondLevelCode, ThirdLevelCode } = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner ?? {}
  const orgForPoliceFilter = `${SecondLevelCode}${ThirdLevelCode !== "00" ? ThirdLevelCode : ""}`
  const courtCaseUpdateQuery = entityManager.createQueryBuilder().update<CourtCase>(CourtCase)
  courtCaseUpdateQuery.set({
    triggerCount: triggers.length,
    asn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber.substring(0, asnSize),
    ptiurn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN.substring(0, ptiurnSize),
    orgForPoliceFilter
  })

  if (addedTriggers.length > 0 || deletedTriggers.length > 0) {
    if (triggers.length === 0) {
      courtCaseUpdateQuery.set({
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerReason: null,
        triggerStatus: null,
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerQualityChecked: null,
        triggerInsertedTimestamp: null
      })
    } else if (triggers.every((trigger) => trigger.status === "Resolved")) {
      courtCaseUpdateQuery.set({
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerStatus: "Resolved",
        triggerResolvedBy: "System",
        triggerResolvedTimestamp: triggerTimestamp,
        triggerQualityChecked: 1 //Unchecked - TODO: Refactor to use enum/type
      })
    } else if (triggers.some((trigger) => trigger.status === "Resolved")) {
      courtCaseUpdateQuery.set({
        resolutionTimestamp: null,
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerStatus: "Unresolved",
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerQualityChecked: 1, //Unchecked - TODO: Refactor to use enum/type
        triggerInsertedTimestamp: triggerTimestamp
      })
    }
  }

  const updateResult = await courtCaseUpdateQuery.execute().catch((error) => error as Error)
  if (isError(updateResult)) {
    return updateResult
  }

  if (!updateResult.affected || updateResult.affected === 0) {
    return Error("Couldn't update the court case")
  }

  return { orgForPoliceFilter }
}

export default updateCourtCase
