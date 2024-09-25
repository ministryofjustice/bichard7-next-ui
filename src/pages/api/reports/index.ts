import { json2csv } from "json-2-csv"
import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import { isError } from "types/Result"
import formatResolvedCaseReport from "utils/reports/formatResolvedCaseReport"
import { extractSearchParamsFromQuery } from "utils/validateQueryParams"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["GET"]
  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth

  const caseListQueryParams = extractSearchParamsFromQuery(req.query, currentUser)
  const dataSource = await getDataSource()

  const courtCases = await listCourtCases(dataSource, caseListQueryParams, currentUser)

  if (isError(courtCases)) {
    throw courtCases
  }

  const report = json2csv(formatResolvedCaseReport(courtCases.result))

  res.status(200).json({ report })
}
