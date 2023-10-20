import fs from "fs"
import parseHearingOutcome from "./parseHearingOutcome"
import { parseAhoXml } from "@moj-bichard7-developers/bichard7-next-core/core/parse/parseAhoXml"
import parseAnnotatedPNCUpdateDatasetXml from "@moj-bichard7-developers/bichard7-next-core/core/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
import dummyAho from "../../test/test-data/AnnotatedHO1.json"

jest.mock("@moj-bichard7-developers/bichard7-next-core/core/parse/parseAhoXml")
jest.mock(
  "@moj-bichard7-developers/bichard7-next-core/core/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
)

beforeEach(() => {
  ;(parseAhoXml as jest.Mock).mockImplementation(
    jest.requireActual("@moj-bichard7-developers/bichard7-next-core/core/parse/parseAhoXml").parseAhoXml
  )
  ;(parseAnnotatedPNCUpdateDatasetXml as jest.Mock).mockImplementation(
    jest.requireActual(
      "@moj-bichard7-developers/bichard7-next-core/core/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
    ).default
  )
})

afterEach(async () => {
  jest.resetAllMocks()
  jest.clearAllMocks()
})

describe("parseHearingOutcome", () => {
  it("Should return the error when hearing outcome XML is invalid", () => {
    expect(parseHearingOutcome("not an XML")).toEqual(new Error("Could not parse AHO XML"))
  })

  it("Should call parseAnnotatedPNCUpdateDatasetXml when the XML is a isPncUpdateDataset", () => {
    const dummyPNCUpdateDataset = fs.readFileSync("test/test-data/AnnotatedPNCUpdateDataset.xml").toString()
    parseHearingOutcome(dummyPNCUpdateDataset)

    expect(parseAnnotatedPNCUpdateDatasetXml).toHaveBeenCalledTimes(1)
    expect(parseAnnotatedPNCUpdateDatasetXml).toHaveBeenCalledWith(dummyPNCUpdateDataset)
  })

  it("Should call parseAhoXml when the XML is not a isPncUpdateDataset", () => {
    parseHearingOutcome(dummyAho.hearingOutcomeXml)

    expect(parseAhoXml).toHaveBeenCalledTimes(1)
    expect(parseAhoXml).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
  })
})
