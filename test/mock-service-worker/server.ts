import { setupServer } from "msw/node"
import { conductor } from "./conductor"

// modules export arrays of handlers
const handlers = [...conductor]
export const server = setupServer(...handlers)
