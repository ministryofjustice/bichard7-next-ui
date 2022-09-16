import { IncomingMessage } from "http"

export const isPost = (request: IncomingMessage) => {
  return request.method === "POST"
}
