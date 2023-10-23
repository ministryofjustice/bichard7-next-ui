import { Workflow } from "@io-orkes/conductor-javascript"
import axios from "axios"
import { basicAuthenticationHeaders } from "./auth"

import { CONDUCTOR_API_URL } from "../../config"
import PromiseResult from "types/PromiseResult"

const conductorApi = axios.create({
  headers: basicAuthenticationHeaders()
})

export const fetchBichardProcessByCorrelationId = async (correlationId: string): PromiseResult<Workflow> =>
  conductorApi
    .get(`${CONDUCTOR_API_URL}/api/workflow/bichard_process/correlated/${correlationId}`)
    .then((response) =>
      (response.data as Workflow[]).length
        ? (response.data[0] as Workflow)
        : new Error(`No workflow returned for correlation ID: ${correlationId}`)
    )
    .catch((e) => e)
