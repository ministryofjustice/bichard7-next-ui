import { ValueTransformer } from "typeorm"

const delimitedNumberString = (delimeter: string): ValueTransformer => ({
  to: (value: number[]): string => value.map((i) => i.toString().padStart(3, "0")).join(delimeter),
  from: (value?: string): number[] => value?.split(delimeter).filter(Boolean).map(Number) ?? []
})

export default delimitedNumberString
