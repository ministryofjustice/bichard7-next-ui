import { ValueTransformer } from "typeorm"

const featureFlagTransformer: ValueTransformer = {
  to: (value) => JSON.stringify(value),
  from: (value) => (value !== null ? JSON.parse(value) : {})
}

export default featureFlagTransformer
