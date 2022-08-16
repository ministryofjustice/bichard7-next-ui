import { ValueTransformer } from "typeorm"
import KeyValuePair from "types/KeyValuePair"
import { ResolutionStatus } from "types/ResolutionStatus"

const resolutionStatusByCode: KeyValuePair<number, ResolutionStatus> = {
  1: "Unresolved",
  2: "Resolved",
  3: "Submitted"
}

const resolutionStatusTransformer: ValueTransformer = {
  from: (value: number) => resolutionStatusByCode[value],
  to: (value: ResolutionStatus) =>
    Object.keys(resolutionStatusByCode)
      .map((num) => Number(num))
      .find((code) => resolutionStatusByCode[code] === value)
}

export default resolutionStatusTransformer
