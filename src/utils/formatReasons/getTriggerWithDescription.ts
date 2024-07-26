import triggerDefinitions from "@moj-bichard7-developers/bichard7-next-data/dist/data/trigger-definitions.json"

const getTriggerWithDescription = (triggerCode: string, withoutTriggerCode?: boolean): string => {
  let triggerWithDescription = triggerCode

  triggerDefinitions.filter((record) => {
    if (record.code === triggerCode) {
      if (withoutTriggerCode) {
        triggerWithDescription = `${record.shortDescription}`
      } else {
        triggerWithDescription = `${triggerCode} - ${record.shortDescription}`
      }
    }
  })

  return triggerWithDescription
}

export default getTriggerWithDescription
