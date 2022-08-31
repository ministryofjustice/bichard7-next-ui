import { expect } from "@jest/globals"
import User from "../../../src/services/entities/User"
import fromPairs from "lodash.frompairs"

describe("User", () => {
  it("shouldn't give access to features when flags are absent", () => {
    const user = new User()
    const result = user.hasAccessToFeature("test-feature")

    expect(result).toBe(false)
  })

  it("should give access to a feature when the flag is enabled", () => {
    const user = new User()
    user.featureFlags = { "test-feature": true }
    const result = user.hasAccessToFeature("test-feature")

    expect(result).toBe(true)
  })

  it("shouldn't give access to a feature when the flag is enabled for a different feature", () => {
    const user = new User()
    user.featureFlags = { "test-feature": true }
    const result = user.hasAccessToFeature("other-feature")

    expect(result).toBe(false)
  })

  it("should give access to enabled features when many flags are enabled", () => {
    const user = new User()
    // eslint-disable-next-line @typescript-eslint/naming-convention
    user.featureFlags = fromPairs(new Array(100).fill(0).map((_, i) => ["feature" + i, true]))

    expect(user.hasAccessToFeature("unrelated-feature")).toBe(false)
    expect(user.hasAccessToFeature("feature5")).toBe(true)
    expect(user.hasAccessToFeature("feature99")).toBe(true)
  })

  it("shouldn't give access to explicitly disabled features", () => {
    const user = new User()
    user.featureFlags = { "test-feature": false }

    expect(user.hasAccessToFeature("test-feature")).toBe(false)
  })
})
