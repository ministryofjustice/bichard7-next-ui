import { ValueTransformer } from "typeorm"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/build/src/serialise/ahoXml/generate"

const ahoTransformer: ValueTransformer = {
  to: (value) => parseAhoXml(value),
  from: (value) => convertAhoToXml(value)
}

export default ahoTransformer
