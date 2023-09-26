import { rest } from "msw"

import { CONDUCTOR_API_URL } from "../../src/config"

export const conductor = [
  rest.get(`${CONDUCTOR_API_URL}/api/workflow/bichard_process/correlated/*`, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          workflowId: "test workflow id"
        }
      ])
    )
  }),
  rest.post(`${CONDUCTOR_API_URL}/api/queue/update/*/wait_for_resubmission/COMPLETED`, (_req, res, ctx) =>
    res(ctx.status(200))
  )
]
