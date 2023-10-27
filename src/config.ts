import { TriggerCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/TriggerCode"

export const MAX_NOTE_LENGTH = 1000
export const MAX_FEEDBACK_LENGTH = 2000
export const AUDIT_LOG_API_URL = process.env.AUDIT_LOG_API_URL ?? "http://localhost:7010"
export const AUDIT_LOG_API_KEY = process.env.AUDIT_LOG_API_KEY ?? "dummy_api_key"
export const AUDIT_LOG_EVENT_SOURCE = "Bichard New UI"
export const REALLOCATE_CASE_TRIGGER_CODE = TriggerCode.TRPR0028
export const OUT_OF_AREA_TRIGGER_CODE = TriggerCode.TRPR0027
export const SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS = 3
export const COOKIES_SECURE_OPTION = (process.env.COOKIES_SECURE ?? "true") === "true"
export const CSRF = {
  tokenName: "CSRFToken",
  cookieSecret: process.env.CSRF_COOKIE_SECRET ?? "OliverTwist1",
  formSecret: process.env.CSRF_FORM_SECRET ?? "OliverTwist2",
  maximumTokenAgeInSeconds: parseInt(process.env.CSRF_TOKEN_MAX_AGE ?? "600", 10)
}
export const CONDUCTOR_API_URL = process.env.CONDUCTOR_API_URL ?? "http://localhost:5002"
export const CONDUCTOR_API_USER = process.env.CONDUCTOR_API_USER ?? "bichard"
export const CONDUCTOR_API_PASSWORD = process.env.CONDUCTOR_API_PASSWORD ?? "password"
export const ENABLE_CORE_PHASE1 = process.env.ENABLE_CORE_PHASE1 ?? "false"
