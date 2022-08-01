import { ValueTransformer } from "typeorm"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"

const ahoTransformer: ValueTransformer = {
  to: (value) => parseAhoXml(value),
  from: (value) => value
}

export default ahoTransformer
