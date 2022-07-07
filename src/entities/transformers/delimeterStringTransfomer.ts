import { ValueTransformer } from "typeorm"

const delimeterStringTransfomer = (delimeter: string): ValueTransformer => ({
  to: (value: string[]) => value.join(delimeter),
  from: (value?: string) => value?.split(delimeter) ?? []
})

export default delimeterStringTransfomer
