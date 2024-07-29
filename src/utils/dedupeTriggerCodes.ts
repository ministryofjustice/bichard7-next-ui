import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"

const isLongCode = (code: string): boolean => code === getLongTriggerCode(code)

const isDupe = (code: string, codes: string[]): boolean => {
  const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i)
  return duplicates.includes(code)
}

const dedupeTriggerCodes = (reasonCodes: string): string => {
  const codes = reasonCodes.split(" ")
  const longCodes = codes.map((code) => getLongTriggerCode(code) || code)

  const dedupedCodes = codes.reduce<string[]>((filteredCodes, code) => {
    if (isLongCode(code)) {
      if (!isDupe(code, longCodes)) {
        filteredCodes.push(code)
      }
    } else {
      filteredCodes.push(code)
    }

    return filteredCodes
  }, [])

  return dedupedCodes.join(" ")
}

export default dedupeTriggerCodes
