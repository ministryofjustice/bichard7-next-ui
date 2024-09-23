import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods = ["GET"]
  const auth = withApiAuthentication(req, res, allowedMethods)

  if (!auth) {
    return
  }

  res.status(200).end()
}
