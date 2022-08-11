import { ValueTransformer } from "typeorm"

const booleanTransformer: ValueTransformer = {
  to: (value) => (value ? 1 : 0),
  from: (value) => value === 1
}

export default booleanTransformer
