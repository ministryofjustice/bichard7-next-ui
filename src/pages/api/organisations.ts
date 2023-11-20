import type { NextApiRequest, NextApiResponse } from "next"

import OrganisationUnits from "@moj-bichard7-developers/bichard7-next-data/data/organisation-unit.json"

const FilteredOrganisationUnits = OrganisationUnits.filter(
  (organisationUnit) => organisationUnit.topLevelName !== "Police Service"
)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let filteredByQuery

  if (req.query && req.query.query) {
    const query = req.query.query as string
    filteredByQuery = FilteredOrganisationUnits.filter((organisationUnit) =>
      organisationUnit.thirdLevelName.toLowerCase().startsWith(query.toLowerCase())
    )
  } else {
    filteredByQuery = FilteredOrganisationUnits
  }

  res.status(200).json(filteredByQuery)
}
