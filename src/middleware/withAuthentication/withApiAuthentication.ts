import { NextApiRequest, NextApiResponse } from "next"
import getUser from "services/getUser" // Import your getUser function
import parseJwtCookie from "middleware/withAuthentication/parseJwtCookie"
import { isError, Result } from "types/Result"
import User from "services/entities/User"
import getDataSource from "../../services/getDataSource"

const withApiAuthentication = (handler: (req: NextApiRequest, res: NextApiResponse, currentUser: User) => void) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authJwt = parseJwtCookie(req)
    let currentUser: Result<User | null> = null

    if (authJwt) {
      const dataSource = await getDataSource()
      currentUser = await getUser(dataSource, authJwt.username, authJwt.groups)
    }

    if (isError(currentUser)) {
      console.error("Failed to retrieve user with error:", currentUser.message)
      res.status(502).json({ message: "Bad Gateway" })
      return
    }

    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    handler(req, res, currentUser)
  }
}

export default withApiAuthentication
