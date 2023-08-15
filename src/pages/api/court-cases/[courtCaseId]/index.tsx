import { NextApiRequest, NextApiResponse } from "next"
import withApiAuthentication from "../../../../middleware/withAuthentication/withApiAuthentication"
import type User from "services/entities/User"
import unlockCourtCase from "../../../../services/unlockCourtCase"
import getDataSource from "../../../../services/getDataSource"
import UnlockReason from "../../../../types/UnlockReason"
import { isError } from "../../../../types/Result"

export default withApiAuthentication(async (req: NextApiRequest, res: NextApiResponse, currentUser: User) => {
  const dataSource = await getDataSource()

  switch (req.method) {
    case "PATCH":
      const courtCaseId = req.query.courtCaseId as unknown as number
      const unlockResult = await unlockCourtCase(dataSource, courtCaseId, currentUser, UnlockReason.TriggerAndException).catch(error => error)

      if (!isError(unlockResult)) {
        return res.status(200).json({ success: true, result: unlockResult})
      } else {
        return res.status(500).json({ success: false,  error: unlockResult.message})
      }
  }
})
