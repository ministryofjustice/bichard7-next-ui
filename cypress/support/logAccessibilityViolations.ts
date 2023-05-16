// eslint-disable-next-line import/no-extraneous-dependencies
import { Result } from "axe-core"

const logAccessibilityViolations = (violations: Result[]) => {
  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length
  }))

  cy.task("table", violationData)
}

export default logAccessibilityViolations
