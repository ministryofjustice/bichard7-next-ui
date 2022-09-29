import { toHaveNoViolations } from "jest-axe"
import { expect } from "@storybook/jest"
expect.extend(toHaveNoViolations)

export default expect
