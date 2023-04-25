import triggers from "./triggers.json"

type TriggerInfo = {
  description: string
  pncScreenToUpdate: string
  cjsResultCode: string
}

const getTriggerInfo = (triggerCode: string): TriggerInfo =>
  Object.entries(triggers).find(([key]) => key == triggerCode)?.[1] as TriggerInfo

export default getTriggerInfo
