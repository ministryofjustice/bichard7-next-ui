import { FindOperator, ValueTransformer } from "typeorm"
import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import { ResolutionStatus } from "types/ResolutionStatus"
import resolveFindOperator from "./resolveFindOperator"

const resolutionStatusByCode: KeyValuePair<number, ResolutionStatus> = {
  1: "Unresolved",
  2: "Resolved",
  3: "Submitted"
}

const getResolutionStatusCodeByText = (text: string) =>
  Object.keys(resolutionStatusByCode)
    .map((num) => Number(num))
    .find((code) => resolutionStatusByCode[code] === text)

const resolutionStatusTransformer: ValueTransformer = {
  from: (value: number) => {
    return resolutionStatusByCode[value]
  },
  to: (value: ResolutionStatus | FindOperator<ResolutionStatus>) => {
    return resolveFindOperator(value, (input) => getResolutionStatusCodeByText(input))
  }
}

export default resolutionStatusTransformer
