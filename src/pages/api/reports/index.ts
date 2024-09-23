import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods = ["GET"]
  const auth = withApiAuthentication(req, res, allowedMethods)

  if (!auth) {
    return
  }

  // TODO: validate query params
  // TODO: get cases from db
  // TODO: convert case list to report
  // TODO: generate CSV

  res.status(200).end()
}
