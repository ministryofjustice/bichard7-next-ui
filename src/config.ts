import { TriggerCode } from "@moj-bichard7-developers/bichard7-next-core/dist/types/TriggerCode"

export const MAX_NOTE_LENGTH = 1000
export const MAX_FEEDBACK_LENGTH = 2000
export const AUDIT_LOG_API_URL = process.env.AUDIT_LOG_API_URL ?? "http://localhost:7010"
export const AUDIT_LOG_API_KEY = process.env.AUDIT_LOG_API_KEY ?? "dummy_api_key"
export const AUDIT_LOG_EVENT_SOURCE = "Bichard New UI"
export const REALLOCATE_CASE_TRIGGER_CODE = "TRPR0028" as TriggerCode
export const OUT_OF_AREA_TRIGGER_CODE = TriggerCode.TRPR0027
export const SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS = 3
