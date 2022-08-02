import { ValueTransformer } from "typeorm"

const dateTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => new Date(value)
}

export default dateTransformer
