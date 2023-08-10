import { NextApiRequest, NextApiResponse } from "next"
import withApiAuthentication from "../../../../middleware/withAuthentication/withApiAuthentication"
import type User from "services/entities/User"

export default withApiAuthentication((req: NextApiRequest, res: NextApiResponse, currentUser: User) => {
  switch (req.method) {
    case "PATCH":
      res.status(200).json({ success: true, username: currentUser.email })
      break
  }
})
