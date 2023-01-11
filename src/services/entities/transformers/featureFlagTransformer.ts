import { ValueTransformer } from "typeorm"

const featureFlagTransformer: ValueTransformer = {
  to: (value) => JSON.stringify(value),
  from: (value) => (value && value !== null && Object.keys(value)?.length > 0 ? JSON.parse(JSON.stringify(value)) : {})
}

export default featureFlagTransformer
