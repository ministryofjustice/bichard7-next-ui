import { ValueTransformer } from "typeorm"

const featureFlagTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => (value && value !== null && Object.keys(value)?.length > 0 ? value : {})
}

export default featureFlagTransformer
