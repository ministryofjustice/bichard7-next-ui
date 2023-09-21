import { Workflow } from "@io-orkes/conductor-javascript"
import axios from "axios"
import { basicAuthenticationHeaders } from "./auth"

const { CONDUCTOR_API_URL } = process.env

export const fetchWorkflowByCorrelationId = async (correlationId: string): Promise<Workflow | Error> =>
  axios
    .get(`${CONDUCTOR_API_URL}/api/workflow/bichard_process/correlated/${correlationId}`, {
      headers: basicAuthenticationHeaders()
    })
    .catch((e) => e)
