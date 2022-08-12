import { ValueTransformer } from "typeorm"

const optionalNullColumn: ValueTransformer = {
  to: (value) => (value === undefined ? null : value),
  from: (value) => (value === null ? undefined : value)
}

export default optionalNullColumn
