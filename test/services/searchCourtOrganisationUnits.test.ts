import { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import searchCourtOrganisationUnits, {
  getOrganisationCodeAndName
} from "../../src/services/searchCourtOrganisationUnits"

describe("searchCourtOrganisationUnits", () => {
  it("Should return an empty array when search keyword is an empty string", () => {
    expect(searchCourtOrganisationUnits("")).toEqual([])
  })

  it("Should return one organisation unit when there is an exact match", () => {
    const result = searchCourtOrganisationUnits("B01EF00")
    expect(result).toHaveLength(1)

    const org = result[0] as OrganisationUnit
    expect(org.topLevelCode).toEqual("B")
    expect(org.secondLevelCode).toEqual("01")
    expect(org.thirdLevelCode).toEqual("EF")
    expect(org.bottomLevelCode).toEqual("00")
    expect(org.topLevelName).toEqual("Magistrates' Courts")
    expect(org.secondLevelName).toEqual("London")
    expect(org.thirdLevelName).toEqual("Croydon")
    expect(org.bottomLevelName).toEqual("")
  })

  it("Should not include police organisations", () => {
    const metropolitanPoliceOrgCode = "010000"
    expect(searchCourtOrganisationUnits(metropolitanPoliceOrgCode)).toHaveLength(0)
  })

  it("Should return many organisation units when there is a partial match of org code", () => {
    expect(searchCourtOrganisationUnits("B01")).toHaveLength(34)
    expect(searchCourtOrganisationUnits("B01C")).toHaveLength(3)
    expect(searchCourtOrganisationUnits("B01CA")).toHaveLength(0)
    expect(searchCourtOrganisationUnits("B01DU")).toHaveLength(1)
  })

  it("Should return many organisation units when there is a partial match of org name", () => {
    const result = searchCourtOrganisationUnits("Croydon")
    expect(result).toHaveLength(3)

    const organisations = result as OrganisationUnit[]
    expect(getOrganisationCodeAndName(organisations[0])).toEqual("C01CY00 Crown Courts London Croydon")
    expect(getOrganisationCodeAndName(organisations[1])).toEqual("B01EF00 Magistrates' Courts London Croydon")
    expect(getOrganisationCodeAndName(organisations[2])).toEqual("C01JI00 Crown Courts London Jury's Inn Croydon")
  })
})
