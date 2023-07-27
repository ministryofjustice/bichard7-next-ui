import { REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import CourtCase from "../entities/CourtCase"
import recalculateTriggers from "./recalculateTriggers"
import { default as TriggerEntity } from "../entities/Trigger"
import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"
import { TriggerCode } from "@moj-bichard7-developers/bichard7-next-core/dist/types/TriggerCode"
import { ResolutionStatus } from "../../types/ResolutionStatus"

describe("recalculateTriggers", () => {
  const dummyId = 0
  const dummyItemIdentity = 1111111

  const getCaseTrigger = (code: TriggerCode, status: ResolutionStatus): TriggerEntity => {
    return {
      triggerId: dummyId,
      triggerItemIdentity: dummyItemIdentity,
      triggerCode: code,
      status: status
    } as Partial<TriggerEntity> as TriggerEntity
  }

  const getTrigger = (code: TriggerCode, offenceSequenceNumber?: number): Trigger => {
    return {
      offenceSequenceNumber: offenceSequenceNumber ?? dummyItemIdentity,
      code: code
    }
  }

  const testCases: {
    description: string
    existingTriggers: TriggerEntity[]
    newTriggers: Trigger[]
    expectedTriggerToAdd: Trigger[]
    expectedTriggersToDelete: Trigger[]
  }[] = [
    {
      description: "It deletes all triggers when new triggers are empty",
      existingTriggers: [
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0003, "Resolved"),
        getCaseTrigger(TriggerCode.TRPR0004, "Submitted")
      ],
      newTriggers: [],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [
        getTrigger(TriggerCode.TRPR0001),
        getTrigger(TriggerCode.TRPR0002),
        getTrigger(TriggerCode.TRPR0003),
        getTrigger(TriggerCode.TRPR0004)
      ]
    },
    {
      description: "It deletes a trigger that is not in the new trigger list",
      existingTriggers: [
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [getTrigger(TriggerCode.TRPR0001)]
    },
    {
      description: "It adds triggers that aren't in the new trigger list",
      existingTriggers: [getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")],
      newTriggers: [getTrigger(TriggerCode.TRPR0002), getTrigger(TriggerCode.TRPR0003)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0003)],
      expectedTriggersToDelete: []
    },
    {
      description: "It ignores trigger that is in both existing and new trigger list",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It ignores an unresolved REALLOCATE trigger that is in both existing and new trigger list",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It adds a REALLOCATE trigger when there is a new REALLOCATE trigger and there is no existing REALLOCATE trigger",
      existingTriggers: [],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It adds a REALLOCATE_CASE_TRIGGER_CODE trigger " +
        "when existing REALLOCATE_CASE_TRIGGER_CODE is resolved " +
        "and new triggers has REALLOCATE_CASE_TRIGGER_CODE",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Resolved")],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It doesn't add a new REALLOCATE trigger when the existing REALLOCATE trigger is resolved, but there is another unresolved trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Resolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")
      ],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete an unresolved REALLOCATE trigger when the case has a resolved trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete an unresolved REALLOCATE trigger when the case has multiple resolved triggers",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Resolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete an unresolved REALLOCATE trigger when there are no other triggers",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It deletes an unresolved REALLOCATE trigger when the case has an unresolved trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Resolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)]
    }
  ]

  test.each(testCases)(
    "$description",
    ({ existingTriggers, newTriggers, expectedTriggerToAdd, expectedTriggersToDelete }) => {
      const courtCase = { triggers: existingTriggers } as unknown as CourtCase
      const result = recalculateTriggers(courtCase, newTriggers)

      expect(result.triggersToAdd).toEqual(expectedTriggerToAdd)
      expect(result.triggersToDelete).toEqual(expectedTriggersToDelete)
    }
  )
})
