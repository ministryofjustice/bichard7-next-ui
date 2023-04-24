import type { KeyValuePair } from "types/KeyValuePair"

type ErrorResult = { count: number; fields: { name: string; displayName: string }[] }

const formatFieldName = (name: string) => {
  const words = name.match(/([A-Z]+[a-z]+)/g)
  if (words) {
    const firstWord = words[0]
    return firstWord + words.join(" ").slice(firstWord.length).toLowerCase()
  }

  return name
}

const groupErrorsFromReport = (errorReport: string): KeyValuePair<string, ErrorResult> => {
  return errorReport.split(",").reduce((errors, report) => {
    const code = report.split("||")[0].trim()
    const field = report.split("||")[1]?.split(":")[1]?.trim()
    errors[code] = errors[code] ?? { count: 0, fields: [] }
    errors[code].count += 1
    if (field) {
      errors[code].fields.push({
        name: field,
        displayName: formatFieldName(field)
      })
    }
    return errors
  }, {} as KeyValuePair<string, ErrorResult>)
}

export default groupErrorsFromReport
