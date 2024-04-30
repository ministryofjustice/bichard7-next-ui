import createDummyAho from "../../test/helpers/createDummyAho"
import { HO100310 } from "../../test/helpers/exceptions"
import { Amendments } from "../types/Amendments"
import isOffenceMatchingValid from "./isOffenceMatchingValid"

describe("isOffenceMatchingValid", () => {
  const dummyAho = createDummyAho()

  it("returns true if no exceptions exist", () => {
    dummyAho.Exceptions.length = 0

    const amendments: Amendments = {}
    const result = isOffenceMatchingValid(dummyAho.Exceptions, amendments.offenceReasonSequence)

    expect(result).toBe(true)
  })

  it("returns true if all offences are matched", () => {
    dummyAho.Exceptions.length = 0
    HO100310(dummyAho)

    const amendments: Amendments = {
      offenceReasonSequence: [
        {
          offenceIndex: 0
        }
      ]
    }

    expect(isOffenceMatchingValid(dummyAho.Exceptions, amendments.offenceReasonSequence)).toBe(true)
  })

  it("returns false if any offences aren't matched", () => {
    dummyAho.Exceptions.length = 0
    HO100310(dummyAho)

    const amendments: Amendments = { offenceReasonSequence: [] }

    expect(isOffenceMatchingValid(dummyAho.Exceptions, amendments.offenceReasonSequence)).toBe(false)
  })

  it.skip("returns false if some exceptions are matched", () => {})
})
