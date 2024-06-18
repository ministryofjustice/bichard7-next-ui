import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import amendCourtCase from "services/amendCourtCase/amendCourtCase"
import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { isError } from "types/Result"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["PATCH", "PUT", "POST"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth

  const dataSource = await getDataSource()
  const amendments = req.body

  const { courtCaseId } = req.query

  if (!courtCaseId) {
    res.status(404)
    res.end()
    return
  }

  const courtCase = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: +courtCaseId } })

  if (!courtCase) {
    res.status(404)
    res.end()
    return
  }

  const amendCourtcaseResponse = await amendCourtCase(dataSource, amendments, courtCase, currentUser)

  if (isError(amendCourtcaseResponse)) {
    res.status(500)
    res.end()
  }

  res.status(202)
  res.end()
}
