import parseAnnotatedPNCUpdateDatasetXml from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
import { isPncUpdateDataset } from "./isPncUpdateDataset"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import { isError } from "../types/Result"
import { parseAhoXml } from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml"

const parseHearingOutcome = (hearingOutcome: string): AnnotatedHearingOutcome | Error => {
  let aho: AnnotatedHearingOutcome | Error

  if (isPncUpdateDataset(hearingOutcome)) {
    const pncUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(hearingOutcome)

    if (isError(pncUpdateDataset)) {
      console.error(`Failed to parse AnnotatedPNCUpdateDatasetXml: ${pncUpdateDataset}`)

      aho = pncUpdateDataset
    } else {
      aho = pncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
    }
  } else {
    aho = parseAhoXml(hearingOutcome)

    if (isError(aho)) {
      console.error(`Failed to parse aho: ${aho}`)
    }
  }

  return aho
}

export default parseHearingOutcome
