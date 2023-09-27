const { rest } = require("msw")

const { CONDUCTOR_API_URL } = process.env.CONDUCTOR_API_URL || "http://localhost:5002"

// MSW docs: mswjs.io/docs/
module.exports = [
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