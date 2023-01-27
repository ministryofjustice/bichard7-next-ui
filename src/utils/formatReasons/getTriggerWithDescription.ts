import triggerDefinitions from "@moj-bichard7-developers/bichard7-next-data/dist/data/trigger-definitions.json"

const getTriggerWithDescription = (triggerCode: string): string => {
  let triggerWithDescription = triggerCode
  triggerDefinitions.forEach((record) => {
    if (record.code === triggerCode) {
      triggerWithDescription = `${triggerCode} - ${record.shortDescription}`
    }
  })
  return triggerWithDescription
}

export default getTriggerWithDescription
