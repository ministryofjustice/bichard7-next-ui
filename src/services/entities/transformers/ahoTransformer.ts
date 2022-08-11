import { ValueTransformer } from "typeorm"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/build/src/serialise/ahoXml/generate"

const ahoTransformer: ValueTransformer = {
  to: (value) => convertAhoToXml(value),
  from: (value) => parseAhoXml(value)
}

export default ahoTransformer
