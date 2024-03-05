import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
  message: string
}

export default function handler(_: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).end()
}
