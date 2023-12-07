import type { NextApiRequest, NextApiResponse } from "next"
import OrganisationUnitApiResponse from "../../types/OrganisationUnitApiResponse"
import searchCourtOrganisationUnits, {
  getFullOrganisationCode,
  getFullOrganisationName
} from "../../services/searchCourtOrganisationUnits"

export default (req: NextApiRequest, res: NextApiResponse<OrganisationUnitApiResponse>) => {
  const searchQueryString = ((req.query.search as string) || "").toLowerCase()

  const filteredItems = searchCourtOrganisationUnits(searchQueryString).map((ou) => ({
    fullOrganisationCode: getFullOrganisationCode(ou),
    fullOrganisationName: getFullOrganisationName(ou)
  }))

  res.status(200).json(filteredItems.slice(0, 20))
}
