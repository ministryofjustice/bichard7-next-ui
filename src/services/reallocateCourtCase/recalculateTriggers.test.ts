import { REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import CourtCase from "../entities/CourtCase"
import recalculateTriggers from "./recalculateTriggers"
import { default as TriggerEntity } from "../entities/Trigger"
import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Trigger"

describe("recalculateTriggers", () => {
  const dummyId = 0
  const dummyItemIdentity = 1111111
  const testCases: {
    description: string
    existingTriggers: TriggerEntity[]
    newTriggers: Trigger[]
    expectedTriggerToAdd: Trigger[]
    expectedTriggersToDelete: Trigger[]
  }[] = [
    {
      description: "Can delete REALLOCATE_CASE_TRIGGER_CODE trigger",
      existingTriggers: [
        {
          triggerId: dummyId,
          triggerItemIdentity: dummyItemIdentity,
          triggerCode: REALLOCATE_CASE_TRIGGER_CODE,
          status: "Unresolved"
        } as Partial<TriggerEntity> as TriggerEntity
      ],
      newTriggers: [],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [
        {
          offenceSequenceNumber: dummyItemIdentity,
          code: REALLOCATE_CASE_TRIGGER_CODE
        }
      ]
    },
    {
      description: "Can add REALLOCATE_CASE_TRIGGER_CODE trigger",
      existingTriggers: [],
      newTriggers: [
        {
          code: REALLOCATE_CASE_TRIGGER_CODE,
          offenceSequenceNumber: dummyItemIdentity
        }
      ],
      expectedTriggerToAdd: [
        {
          offenceSequenceNumber: dummyItemIdentity,
          code: REALLOCATE_CASE_TRIGGER_CODE
        }
      ],
      expectedTriggersToDelete: []
    },
    {
      description: "Can ignore REALLOCATE_CASE_TRIGGER_CODE if there is no change",
      existingTriggers: [
        {
          triggerId: dummyId,
          triggerItemIdentity: dummyItemIdentity,
          triggerCode: REALLOCATE_CASE_TRIGGER_CODE,
          status: "Unresolved"
        } as Partial<TriggerEntity> as TriggerEntity
      ],
      newTriggers: [
        {
          code: REALLOCATE_CASE_TRIGGER_CODE,
          offenceSequenceNumber: dummyItemIdentity
        }
      ],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "Can add REALLOCATE_CASE_TRIGGER_CODE trigger " +
        "when existing REALLOCATE_CASE_TRIGGER_CODE is resolved " +
        "but new triggers has REALLOCATE_CASE_TRIGGER_CODE",
      existingTriggers: [
        {
          triggerId: dummyId,
          triggerItemIdentity: dummyItemIdentity,
          triggerCode: REALLOCATE_CASE_TRIGGER_CODE,
          status: "Resolved"
        } as Partial<TriggerEntity> as TriggerEntity
      ],
      newTriggers: [
        {
          code: REALLOCATE_CASE_TRIGGER_CODE
        }
      ],
      expectedTriggerToAdd: [
        {
          code: REALLOCATE_CASE_TRIGGER_CODE
        }
      ],
      expectedTriggersToDelete: []
    }
    // {
    //   description:
    //     "Can delete REALLOCATE_CASE_TRIGGER_CODE trigger " +
    //     "when ",
    //   existingTriggers: [
    //     {
    //       triggerId: dummyId,
    //       triggerItemIdentity: dummyItemIdentity,
    //       triggerCode: REALLOCATE_CASE_TRIGGER_CODE,
    //       status: "Unresolved"
    //     } as Partial<TriggerEntity> as TriggerEntity,
    //     {
    //       triggerId: dummyId,
    //       triggerItemIdentity: dummyItemIdentity,
    //       triggerCode: TriggerCode.TRPR0001,
    //       status: "Resolved"
    //     } as Partial<TriggerEntity> as TriggerEntity
    //   ],
    //   newTriggers: [
    //     {
    //       code: REALLOCATE_CASE_TRIGGER_CODE
    //     }
    //   ],
    //   expectedTriggerToAdd: [],
    //   expectedTriggersToDelete: []
    // }
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
