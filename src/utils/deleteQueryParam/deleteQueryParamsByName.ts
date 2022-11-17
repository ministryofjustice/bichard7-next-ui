const deleteQueryParamsByName = (
  keysToRemove: string[],
  query: { [key: string]: string | string[] | undefined }
): { [key: string]: string | string[] | undefined } => {
  keysToRemove.forEach((key: string) => delete query[key])
  return query
}

export default deleteQueryParamsByName
