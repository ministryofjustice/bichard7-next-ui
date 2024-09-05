export function formatName(name: string) {
  let splitName = name.replace(/\*|\s+/g, "%")

  if (!splitName.endsWith("%")) {
    splitName = `${splitName}%`
  }

  return splitName
}
