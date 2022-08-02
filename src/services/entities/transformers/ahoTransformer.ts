import { ValueTransformer } from "typeorm"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"

const ahoTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => parseAhoXml(value)
}

export default ahoTransformer
