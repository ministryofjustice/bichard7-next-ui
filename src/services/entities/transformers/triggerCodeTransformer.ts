import { ValueTransformer } from "typeorm"

const triggerCodeTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => {
    const triggerType = value.substring(2, 4)
    const triggerNumber = parseInt(value.substring(4), 10)
    if (isNaN(triggerNumber)) {
      return value
    }

    const triggerNumberString = triggerNumber.toString().padStart(2, "0")
    return `${triggerType}${triggerNumberString}`
  }
}

export default triggerCodeTransformer
